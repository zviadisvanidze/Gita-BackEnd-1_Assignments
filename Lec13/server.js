const express = require('express');
const { readExpenses, writeExpenses } = require('./Util/rw.js');

const app = express();
const PORT = 3030;
const SECRET_KEY = 'zviadi123';
const MAX_TAKE = 100;

app.use(express.json());


app.get('/expenses', async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let take = parseInt(req.query.take);

        const expenses = await readExpenses();

        if (isNaN(page) && isNaN(take)) {
            return res.json(expenses);
        }

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(take) || take < 1) take = 30;

        if (take > MAX_TAKE) {
            take = MAX_TAKE;
        }

        const startIndex = (page - 1) * take;
        const endIndex = page * take;
        const paginatedExpenses = expenses.slice(startIndex, endIndex);

        res.json({
            data: paginatedExpenses,
            meta: {
                totalItems: expenses.length,
                currentPage: page,
                itemsPerPage: take,
                totalPages: Math.ceil(expenses.length / take)
            }
        });
    } catch (error) {
      console.error("შეცდომა მონაცემების წაკითხვისას:", error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
});


app.get('/expenses/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const expenses = await readExpenses();
        const expense = expenses.find(e => e.id === id);

        if (!expense) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json(expense);
    } catch (error) {
       console.error("შეცდომა მონაცემების წაკითხვისას:", error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
});


app.post('/expenses', async (req, res) => {
    try {
        const { title, amount } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'სათაური სავალდებულოა და უნდა იყოს ტექსტი' });
        }
        if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'თანხა სავალდებულოა და უნდა იყოს დადებითი რიცხვი' });
        }

        const expenses = await readExpenses();
        const newId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;

        const newExpense = {
            id: newId,
            title: title.trim(),
            amount,
            createdAt: new Date().toISOString()
        };

        expenses.push(newExpense);
        await writeExpenses(expenses);

        res.status(201).json(newExpense);
    } catch (error) {
        console.error("შეცდომა მონაცემების დამატებისას:", error);
        res.status(500).json({ error: 'სერვერზე მონაცემების დამატებისას მოხდა ხარვეზი' });
    }
});


app.put('/expenses/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, amount } = req.body;

        const expenses = await readExpenses();
        const expenseIndex = expenses.findIndex(e => e.id === id);

        if (expenseIndex === -1) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'სათაური არასწორია' });
        }
        if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'თანხა არასწორია' });
        }

        expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            title: title.trim(),
            amount
        };

        await writeExpenses(expenses);
        res.json(expenses[expenseIndex]);
    } catch (error) {
        console.error("შეცდომა მონაცემების განახლებისას:", error);
        res.status(500).json({ error: 'სერვერზე მონაცემების განახლებისას მოხდა ხარვეზი' });
    }
});


app.delete('/expenses/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const clientSecret = req.headers['secret'];

        if (!clientSecret || clientSecret !== SECRET_KEY) {
            return res.status(401).json({ error: 'არასწორი საიდუმლო კოდი (secret)' });
        }

        const expenses = await readExpenses();
        const expenseIndex = expenses.findIndex(e => e.id === id);

        if (expenseIndex === -1) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        const deletedExpense = expenses.splice(expenseIndex, 1);
        await writeExpenses(expenses);

        res.json({ message: 'ხარჯი წარმატებით წაიშალა', deletedExpense: deletedExpense[0] });
    } catch (error) {
        console.error("შეცდომა მონაცემების წაშლისას:", error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაშლისას მოხდა ხარვეზი' });
    }
});


app.listen(PORT, () => {
    console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
});