const authController = require('../controllers/authController');
const passport = require('passport');
const express = require('express');
const router = new express.Router();

const LocalPassportAuth = passport.authenticate('local', { session: false });

// router.post('/signin', authController.signIn);
router.post('/signin', LocalPassportAuth, authController.signIn);
router.post('/refresh', authController.refreshSignIn);
router.post('/signup', authController.signUp);
router.post('/check-email', authController.checkEmail);
router.post('/password-mail', authController.sendMail);
router.post('/re-signin', authController.restartSignIn);
router.get('/import/:imp_uid', authController.getAuthIMPort);
router.get('/import/user/:imp_uid', authController.getAuthIMPortWithUser);

module.exports = router;
