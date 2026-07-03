const { Router } = require('express');
const authController = require('./auth.controller');
const isAuth = require('../../middlewares/isAuth.middleware');
const validate = require('../../middlewares/validate.middleware');
const handleProfilePictureUpload = require('../../middlewares/upload.middleware');
const { signupSchema, loginSchema } = require('./auth.validation');

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', isAuth, authController.getMe);
router.delete('/me', isAuth, authController.deleteMe);
router.post('/me/profile-picture', isAuth, handleProfilePictureUpload, authController.uploadProfilePicture);
router.delete('/me/profile-picture', isAuth, authController.deleteProfilePicture);

module.exports = router;
