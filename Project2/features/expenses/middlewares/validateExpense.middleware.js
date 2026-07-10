const { validateExpenseInput } = require('../expenses.validation');

function validateExpense(req, res, next) {
    const { errors, data } = validateExpenseInput(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
    }

    req.body = data;
    next();
}

module.exports = validateExpense;
