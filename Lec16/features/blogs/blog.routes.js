const { Router } = require('express');
const blogsController = require('./blog.controller');
const isAuth = require('../../middlewares/isAuth.middleware');
const validate = require('../../middlewares/validate.middleware');
const validateObjectId = require('./middlewares/validateObjectId.middleware');
const isOwner = require('./middlewares/isOwner.middleware');
const { createBlogSchema, updateBlogSchema } = require('./blog.validation');

const router = Router();

router.use(isAuth);

router.get('/', blogsController.getAll);
router.get('/:id', validateObjectId, blogsController.getById);
router.post('/', validate(createBlogSchema), blogsController.create);
router.put('/:id', validateObjectId, validate(updateBlogSchema), isOwner, blogsController.update);
router.delete('/:id', validateObjectId, isOwner, blogsController.remove);

module.exports = router;
