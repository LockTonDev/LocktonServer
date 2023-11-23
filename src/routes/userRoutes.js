const userController = require('../controllers/userController');
const UserComstomsController = require('../controllers/userComstomsController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/insert', userController.insert);
router.post('/select', verifyToken, userController.select);
router.post('/update', verifyToken, userController.update);
router.post('/resignation', verifyToken, userController.resignation);
router.post('/updatePassword', verifyToken, userController.updateUserPassword);
router.post('/isVerifyUserEMailAuth', verifyToken, userController.isVerifyUserEMail);
router.post('/isVerifyPassword', verifyToken, userController.isVerifyPassword);
router.post('/isVerifyUser', userController.isVerifyUser);
router.post('/isVerifyUserId', userController.isVerifyUserId);
router.post('/isVerifyUserEMail', userController.isVerifyUserEMail);
router.post('/isVerifyUserRegNo', UserComstomsController.isVerifyUserRegNo);
router.post('/isVerifyEMailAuthCode', userController.isVerifyEMailAuthCode);
router.post('/findCORUserNSendEMail', userController.findCORUserNSendEMail);
router.post('/findJNTUserNSendEMail', userController.findJNTUserNSendEMail);
router.post('/isVerifyUserUUID', userController.isVerifyUserUUID);
router.post('/updatePasswordNotLogin', userController.updatePasswordNotLogin);

module.exports = router;
