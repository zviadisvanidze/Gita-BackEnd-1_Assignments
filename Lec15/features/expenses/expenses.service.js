const Expense = require('./expense.model');

const MAX_TAKE = 100;

async function getAllExpenses(page, take, filters = {}) {
    const query = {};

    if (filters.category) {
        const categories = filters.category
            .split(',')
            .map((c) => c.trim().toLowerCase())
            .filter((c) => c.length > 0);
        if (categories.length > 0) {
            query.category = { $in: categories };
        }
    }

    if (filters.amountFrom !== undefined || filters.amountTo !== undefined) {
        query.amount = {};
        if (filters.amountFrom !== undefined) {
            const from = parseFloat(filters.amountFrom);
            if (!isNaN(from)) query.amount.$gte = from;
        }
        if (filters.amountTo !== undefined) {
            const to = parseFloat(filters.amountTo);
            if (!isNaN(to)) query.amount.$lte = to;
        }
        if (Object.keys(query.amount).length === 0) delete query.amount;
    }

    if (isNaN(page) && isNaN(take)) {
        return Expense.find(query).sort({ createdAt: -1 });
    }

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(take) || take < 1) take = 30;
    if (take > MAX_TAKE) take = MAX_TAKE;

    const skip = (page - 1) * take;
    const totalItems = await Expense.countDocuments(query);

    const data = await Expense.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take);

    return {
        data,
        meta: {
            totalItems,
            currentPage: page,
            itemsPerPage: take,
            totalPages: Math.ceil(totalItems / take),
        },
    };
}

async function getExpenseById(id) {
    return Expense.findById(id);
}

async function createExpense(title, amount, category) {
    const expense = new Expense({ title, amount, category });
    return expense.save();
}

async function updateExpense(id, title, amount, category) {
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

    const updateData = { title: title.trim(), amount };
    if (category !== undefined) {
        updateData.category = category;
    }

    return Expense.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
}

async function deleteExpense(id) {
    return Expense.findByIdAndDelete(id);
}

async function getTop5Expenses() {
    return Expense.find().sort({ amount: -1 }).limit(5);
}

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getTop5Expenses,
};
