const { readExpenses, writeExpenses } = require('../../Util/rw');

async function getAllExpenses(categoryFilter) {
    const expenses = await readExpenses();

    if (!categoryFilter || !categoryFilter.trim()) {
        return expenses;
    }

    const needle = categoryFilter.trim().toLowerCase();
    return expenses.filter(e => e.category.toLowerCase().includes(needle));
}

async function getExpenseById(id) {
    const expenses = await readExpenses();
    return expenses.find(e => e.id === id) || null;
}

async function createExpense(title, amount, category) {
    const expenses = await readExpenses();
    const newId = Math.max(0, ...expenses.map(e => e.id)) + 1;

    const newExpense = {
        id: newId,
        title: title.trim(),
        amount,
        category: category.trim(),
        createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);

    return newExpense;
}

async function updateExpense(id, title, amount, category) {
    const expenses = await readExpenses();
    const index = expenses.findIndex(e => e.id === id);

    if (index === -1) return null;

    expenses[index] = {
        ...expenses[index],
        title: title.trim(),
        amount,
        category: category.trim()
    };

    await writeExpenses(expenses);
    return expenses[index];
}

async function deleteExpense(id) {
    const expenses = await readExpenses();
    const index = expenses.findIndex(e => e.id === id);

    if (index === -1) return null;

    const deletedExpense = expenses.splice(index, 1)[0];
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
