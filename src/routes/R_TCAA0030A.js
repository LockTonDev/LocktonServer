const C_TCAA0030A = require('../controllers/C_TCAA0030A');
const InsuranceRateController = require('../controllers/insuranceRateController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/', verifyToken, C_TCAA0030A.selectList);
router.post('/getSaleRtNDupInfo', verifyToken, C_TCAA0030A.getSaleRtNDupInfo);
router.post('/status', verifyToken, C_TCAA0030A.selectStatus);
router.post('/get', verifyToken, C_TCAA0030A.select);
router.post('/get/history', verifyToken, C_TCAA0030A.selectHistory);
router.post('/set', verifyToken, C_TCAA0030A.insert);
router.post('/set/:insurance_uuid', verifyToken, C_TCAA0030A.update);
router.get('/del/::insurance_uuid', verifyToken, C_TCAA0030A.delete);

router.post('/rate', verifyToken, InsuranceRateController.selectTop);

module.exports = router;
