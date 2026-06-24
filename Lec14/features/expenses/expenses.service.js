const { readExpenses, writeExpenses } = require('../../Util/rw.js');

const MAX_TAKE = 100;

async function getAllExpenses(page, take) {
    const expenses = await readExpenses();

    if (isNaN(page) && isNaN(take)) {
        return expenses;
    }

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(take) || take < 1) take = 30;
    if (take > MAX_TAKE) take = MAX_TAKE;

    const startIndex = (page - 1) * take;
    const endIndex = page * take;
    const paginatedExpenses = expenses.slice(startIndex, endIndex);

    return {
        data: paginatedExpenses,
        meta: {
            totalItems: expenses.length,
            currentPage: page,
            itemsPerPage: take,
            totalPages: Math.ceil(expenses.length / take)
        }
    };
}

async function getExpenseById(id) {
    const expenses = await readExpenses();
    return expenses.find(e => e.id === id) || null;
}

async function createExpense(title, amount) {
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

    return newExpense;
}

async function updateExpense(id, title, amount) {
    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === id);

    if (expenseIndex === -1) return null;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        const error = new Error('სათაური არასწორია');
        error.status = 400;
        throw error;
    }
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
        const error = new Error('თანხა არასწორია');
        error.status = 400;
        throw error;
    }

    expenses[expenseIndex] = {
        ...expenses[expenseIndex],
        title: title.trim(),
        amount
    };

    await writeExpenses(expenses);
    return expenses[expenseIndex];
}

async function deleteExpense(id) {
    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === id);

    if (expenseIndex === -1) return null;

    const deletedExpense = expenses.splice(expenseIndex, 1)[0];
    await writeExpenses(expenses);

    return deletedExpense;
}

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};
