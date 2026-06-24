const { Router } = require('express');
const expensesController = require('./expenses.controller');
const deleteAuth = require('./middlewares/deleteAuth.middleware');
const validateExpense = require('./middlewares/validateExpense.middleware');
const validateObjectId = require('./middlewares/validateObjectId.middleware');

const router = Router();

router.get('/', expensesController.getAll);
router.get('/top-5', expensesController.getTop5);
router.get('/:id', validateObjectId, expensesController.getById);
router.post('/', validateExpense, expensesController.create);
router.put('/:id', validateObjectId, expensesController.update);
router.delete('/:id', validateObjectId, deleteAuth, expensesController.remove);

module.exports = router;
