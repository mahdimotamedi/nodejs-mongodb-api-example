const express = require('express');
const RateLimit = require('express-rate-limit');
const router = express.Router();

// middleware
const apiAuth = require('./middleware/apiAuth');
const { uploadImage } = require('./middleware/UploadMiddleware');

// Controllers 
const HomeController = require('../../controllers/api/v1/HomeController');
const AuthController = require('../../controllers/api/v1/AuthController');
const UserController = require('../../controllers/api/v1/UserController');


// base actions
router.get('/' , HomeController.index);
router.get('/version' , HomeController.version);

// auth actions
let loginLimiter = new RateLimit({
    windowMs: 60*60*1000, // 1 hour window
    delayAfter: 1, // begin slowing down responses after the first request
    delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
    max: 15, // start blocking after 5 requests
    message: "Too many login request from this ip"
});
router.post('/login', loginLimiter , AuthController.login.bind(AuthController));
let registerLimiter = new RateLimit({
    windowMs: 60*60*2000, // 2 hour window
    delayAfter: 1, // begin slowing down responses after the first request
    delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
    max: 4, // start blocking after 5 requests
    message: "Too many register request from this ip"
});
router.post('/register', registerLimiter , AuthController.register.bind(AuthController));
router.get('/sent-verify-email' , apiAuth , AuthController.sentVerifyEmail.bind(AuthController));
router.get('/verify-email' , AuthController.verifyEmail.bind(AuthController));

// forgot password actions
let forgotPasswordLimiter = new RateLimit({
    windowMs: 60*60*1000, // 1 hour window
    delayAfter: 1, // begin slowing down responses after the first request
    delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
    max: 5, // start blocking after 5 requests
    message: "Too many forgot password request from this ip"
});
router.post('/new-password-request', forgotPasswordLimiter , AuthController.newPasswordRequest.bind(AuthController));
router.post('/set-new-password-instead-of-old-one' , AuthController.setNewPasswordInsteadOfOldOne.bind(AuthController));

// user actions
router.get('/user' , apiAuth , UserController.index.bind(UserController));
router.put('/user/edit' , apiAuth , UserController.edit.bind(UserController));
router.post('/user/change-password' , apiAuth , UserController.changePassword.bind(UserController));
router.post('/user/avatar' , apiAuth , uploadImage.single('avatar') , UserController.uploadAvatar.bind(UserController));


module.exports = router;