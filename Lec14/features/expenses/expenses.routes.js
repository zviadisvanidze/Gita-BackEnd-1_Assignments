const { Router } = require('express');
const expensesController = require('./expenses.controller');
const deleteAuth = require('./middlewares/deleteAuth.middleware');
const validateExpense = require('./middlewares/validateExpense.middleware');

const router = Router();

router.get('/', expensesController.getAll);
router.get('/:id', expensesController.getById);
router.post('/', validateExpense, expensesController.create);
router.put('/:id', expensesController.update);
router.delete('/:id', deleteAuth, expensesController.remove);

module.exports = router;
