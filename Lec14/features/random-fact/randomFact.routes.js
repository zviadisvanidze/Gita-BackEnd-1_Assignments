const { Router } = require('express');
const randomFactController = require('./randomFact.controller');
const randomBlock = require('./middlewares/randomBlock.middleware');

const router = Router();

router.get('/', randomBlock, randomFactController.getFact);

module.exports = router;
