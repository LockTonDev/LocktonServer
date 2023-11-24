const authController = require('../controllers/authController');
const C_ADMIN = require('../controllers/C_ADMIN');
const passport = require('passport');
const express = require('express');
const router = new express.Router();

const LocalPassportAuth = passport.authenticate('local', { session: false }); //id, pw 검증
const { verifyToken } = require('../middleware/auth');

router.post('/SYSTEM/get', verifyToken, C_ADMIN.getSystemInfo);
router.post('/COM/setUsersTemp', verifyToken, C_ADMIN.setUsersTemp);
router.post('/COM/getStockStartDtInfo', verifyToken, C_ADMIN.getStockStartDtInfo);

router.post('/USER_REG_NO/set', verifyToken, C_ADMIN.setUserRegNo);
router.post('/USER_REG_NO/gets', verifyToken, C_ADMIN.getUserRegNo);

router.post('/BOARD/get', verifyToken, C_ADMIN.getBoardInfo);
router.post('/BOARD/gets', verifyToken, C_ADMIN.getBoardList);
router.post('/BOARD/ins', verifyToken, C_ADMIN.setInsertBoard);
router.post('/BOARD/udt', verifyToken, C_ADMIN.setUpdateBoard);
router.post('/BOARD/del', verifyToken, C_ADMIN.setDeleteBoard);

router.post('/USER/setUserLoginBlockReset', verifyToken, C_ADMIN.setUserLoginBlockReset);
router.post('/USER/get', verifyToken, C_ADMIN.getUserInfo);
router.post('/USER/gets', verifyToken, C_ADMIN.getUserList);
router.post('/USER/set', verifyToken, C_ADMIN.setUserInfo);
router.post('/USER/setUserPassword', verifyToken, C_ADMIN.setUserPassword);

router.post('/TAX/EXCEL/get', verifyToken, C_ADMIN.getTAXExcel);

router.post('/TAX/APPLY/set', verifyToken, C_ADMIN.setApplyInsurance);
router.post('/TAX/APPLY/get', verifyToken, C_ADMIN.getApplyInsurance);

router.post('/TAX/TRX/set', verifyToken, C_ADMIN.setTAX_TRX);
router.post('/TAX/TRX/get', verifyToken, C_ADMIN.getTAX_TRX);

router.post('/TAX/rate', verifyToken, C_ADMIN.getTAXRate);
router.post('/TAX/get', verifyToken, C_ADMIN.getTAX);
router.post('/TAX/gets', verifyToken, C_ADMIN.getTAXS);
router.post('/TAX/renewal/get', verifyToken, C_ADMIN.getRenewal);
router.post('/TAX/renewal/gets', verifyToken, C_ADMIN.getRenewals);
router.post('/TAX/set', verifyToken, C_ADMIN.setTAX);
router.post('/TAX/renewal/set', verifyToken, C_ADMIN.setTAXRenewal);

router.post('/ADV/rate', verifyToken, C_ADMIN.getADVRate);
router.post('/ADV/set', verifyToken, C_ADMIN.setADV);
router.post('/ADV/get', verifyToken, C_ADMIN.getADV);
router.post('/ADV/gets', verifyToken, C_ADMIN.getADVS);
router.post('/ADV/renewal/set', verifyToken, C_ADMIN.setADVRenewal);
router.post('/ADV/renewal/get', verifyToken, C_ADMIN.getADVRenewal);
router.post('/ADV/renewal/gets', verifyToken, C_ADMIN.getADVRenewals);
router.post('/ADV/TRX/set', verifyToken, C_ADMIN.setADV_TRX);
router.post('/ADV/TRX/get', verifyToken, C_ADMIN.getADV_TRX);
router.post('/ADV/APPLY/set', verifyToken, C_ADMIN.setApplyADVInsurance);
router.post('/ADV/APPLY/get', verifyToken, C_ADMIN.getApplyADVInsurance);
router.post('/ADV/EXCEL/get', verifyToken, C_ADMIN.getADVExcel);

module.exports = router;
