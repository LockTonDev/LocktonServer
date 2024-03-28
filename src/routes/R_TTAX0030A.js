const C_TTAX0030A = require('../controllers/C_TTAX0030A');
const InsuranceRateController = require('../controllers/insuranceRateController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/', verifyToken, C_TTAX0030A.selectList);
router.post('/getSaleRtNDupInfo', verifyToken, C_TTAX0030A.getSaleRtNDupInfo);
router.post('/status', verifyToken, C_TTAX0030A.selectStatus);
router.post('/get', verifyToken, C_TTAX0030A.select);
router.post('/get/history', verifyToken, C_TTAX0030A.selectHistory);
router.post('/set', verifyToken, C_TTAX0030A.insert);
router.post('/set/:insurance_uuid', verifyToken, C_TTAX0030A.update);
router.get('/del/:insurance_uuid', verifyToken, C_TTAX0030A.delete);

router.post('/rate', verifyToken, InsuranceRateController.selectTop);

module.exports = router;
