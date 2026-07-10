const expensesService = require('./expenses.service');

async function getAll(req, res) {
    try {
        const category = req.query.category;
        const expenses = await expensesService.getAllExpenses(category);
        res.json(expenses);
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

async function getById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const expense = await expensesService.getExpenseById(id);

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
        const id = parseInt(req.params.id);
        const { title, amount, category } = req.body;
        const result = await expensesService.updateExpense(id, title, amount, category);

        if (!result) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json(result);
    } catch (error) {
        console.error('შეცდომა მონაცემების განახლებისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების განახლებისას მოხდა ხარვეზი' });
    }
}

async function remove(req, res) {
    try {
        const id = parseInt(req.params.id);
        const deletedExpense = await expensesService.deleteExpense(id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'ხარჯი მოცემული ID-ით ვერ მოიძებნა' });
        }

        res.json({ message: 'ხარჯი წარმატებით წაიშალა', deletedExpense });
    } catch (error) {
        console.error('შეცდომა მონაცემების წაშლისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაშლისას მოხდა ხარვეზი' });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
