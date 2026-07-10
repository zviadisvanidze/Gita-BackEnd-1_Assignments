const { Router } = require('express');
const pagesController = require('./expenses.pages.controller');

const router = Router();

router.get('/', pagesController.showList);
router.get('/expenses/new', pagesController.showCreateForm);
router.post('/expenses', pagesController.handleCreate);
router.get('/expenses/:id/edit', pagesController.showEditForm);
router.post('/expenses/:id/edit', pagesController.handleUpdate);
router.post('/expenses/:id/delete', pagesController.handleDelete);

module.exports = router;
