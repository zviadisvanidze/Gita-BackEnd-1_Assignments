const { Router } = require('express');
const expensesController = require('./expenses.controller');
const validateExpense = require('./middlewares/validateExpense.middleware');

const router = Router();

router.get('/', expensesController.getAll);
router.get('/:id', expensesController.getById);
router.post('/', validateExpense, expensesController.create);
router.put('/:id', validateExpense, expensesController.update);
router.delete('/:id', expensesController.remove);

module.exports = router;
