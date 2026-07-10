const expensesService = require('./expenses.service');
const { validateExpenseInput } = require('./expenses.validation');

async function showList(req, res) {
    try {
        const categoryFilter = req.query.category || '';
        const expenses = await expensesService.getAllExpenses(categoryFilter);
        res.render('index', { expenses, categoryFilter });
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).send('სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი');
    }
}

function showCreateForm(req, res) {
    res.render('new', { errors: [], values: { title: '', amount: '', category: '' } });
}

async function handleCreate(req, res) {
    try {
        const { errors, data } = validateExpenseInput(req.body);

        if (errors.length > 0) {
            return res.status(400).render('new', { errors, values: req.body });
        }

        await expensesService.createExpense(data.title, data.amount, data.category);
        res.redirect('/');
    } catch (error) {
        console.error('შეცდომა მონაცემების დამატებისას:', error);
        res.status(500).send('სერვერზე მონაცემების დამატებისას მოხდა ხარვეზი');
    }
}

async function showEditForm(req, res) {
    try {
        const id = parseInt(req.params.id);
        const expense = await expensesService.getExpenseById(id);

        if (!expense) {
            return res.redirect('/');
        }

        res.render('edit', { errors: [], values: expense });
    } catch (error) {
        console.error('შეცდომა მონაცემების წაკითხვისას:', error);
        res.status(500).send('სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი');
    }
}

async function handleUpdate(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { errors, data } = validateExpenseInput(req.body);

        if (errors.length > 0) {
            return res.status(400).render('edit', { errors, values: { id, ...req.body } });
        }

        const result = await expensesService.updateExpense(id, data.title, data.amount, data.category);

        if (!result) {
            return res.redirect('/');
        }

        res.redirect('/');
    } catch (error) {
        console.error('შეცდომა მონაცემების განახლებისას:', error);
        res.status(500).send('სერვერზე მონაცემების განახლებისას მოხდა ხარვეზი');
    }
}

async function handleDelete(req, res) {
    try {
        const id = parseInt(req.params.id);
        await expensesService.deleteExpense(id);
        res.redirect('/');
    } catch (error) {
        console.error('შეცდომა მონაცემების წაშლისას:', error);
        res.status(500).send('სერვერზე მონაცემების წაშლისას მოხდა ხარვეზი');
    }
}

module.exports = {
    showList,
    showCreateForm,
    handleCreate,
    showEditForm,
    handleUpdate,
    handleDelete
};
