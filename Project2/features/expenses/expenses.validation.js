function validateExpenseInput({ title, amount, category }) {
    const errors = [];

    const cleanTitle = typeof title === 'string' ? title.trim() : '';
    if (!cleanTitle) {
        errors.push('სათაური სავალდებულოა და უნდა იყოს ტექსტი');
    }

    const cleanAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (amount === undefined || amount === null || amount === '' || isNaN(cleanAmount) || cleanAmount <= 0) {
        errors.push('თანხა სავალდებულოა და უნდა იყოს დადებითი რიცხვი');
    }

    const cleanCategory = typeof category === 'string' ? category.trim() : '';
    if (!cleanCategory) {
        errors.push('კატეგორია სავალდებულოა და უნდა იყოს ტექსტი');
    }

    return {
        errors,
        data: {
            title: cleanTitle,
            amount: cleanAmount,
            category: cleanCategory
        }
    };
}

module.exports = { validateExpenseInput };
