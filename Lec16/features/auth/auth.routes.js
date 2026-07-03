const { Router } = require('express');
const authController = require('./auth.controller');
const isAuth = require('../../middlewares/isAuth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { signupSchema, loginSchema } = require('./auth.validation');

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', isAuth, authController.getMe);
router.delete('/me', isAuth, authController.deleteMe);

module.exports = router;
