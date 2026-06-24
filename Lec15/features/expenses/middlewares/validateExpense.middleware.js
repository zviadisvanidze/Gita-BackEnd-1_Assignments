function validateExpense(req, res, next) {
    const { title, amount, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'სათაური სავალდებულოა და უნდა იყოს ტექსტი' });
    }
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'თანხა სავალდებულოა და უნდა იყოს დადებითი რიცხვი' });
    }
    if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
        return res.status(400).json({ error: 'კატეგორია უნდა იყოს ტექსტი' });
    }

    next();
}

module.exports = validateExpense;
