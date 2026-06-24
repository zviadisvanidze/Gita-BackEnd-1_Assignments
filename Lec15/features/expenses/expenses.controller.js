const expensesService = require('./expenses.service');

async function getAll(req, res) {
    try {
        const page = parseInt(req.query.page);
        const take = parseInt(req.query.take);
        const filters = {
            category: req.query.category,
            amountFrom: req.query.amountFrom,
            amountTo: req.query.amountTo,
        };
        const result = await expensesService.getAllExpenses(page, take, filters);
        res.json(result);
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

async function getById(req, res) {
    try {
        const expense = await expensesService.getExpenseById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json(expense);
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

async function create(req, res) {
    try {
        const { title, amount, category } = req.body;
        const newExpense = await expensesService.createExpense(title, amount, category);
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('შეცდომა მონაცემების დამატებისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების დამატებისას მოხდა ხარვეზი' });
    }
}

async function update(req, res) {
    try {
        const { title, amount, category } = req.body;
        const result = await expensesService.updateExpense(req.params.id, title, amount, category);

        if (!result) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json(result);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('შეცდომა მონაცემების განახლებისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების განახლებისას მოხდა ხარვეზი' });
    }
}

async function remove(req, res) {
    try {
        const deletedExpense = await expensesService.deleteExpense(req.params.id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json({ message: 'ხარჯი წარმატებით წაიშალა', deletedExpense });
    } catch (error) {
        console.error('შეცდომა მონაცემების წაშლისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაშლისას მოხდა ხარვეზი' });
    }
}

async function getTop5(req, res) {
    try {
        const top5 = await expensesService.getTop5Expenses();
        res.json(top5);
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getTop5,
};
