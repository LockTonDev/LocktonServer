const C_TTAX0040A = require('../controllers/C_TTAX0040A');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/', verifyToken, C_TTAX0040A.selectList);
router.get('/:apply_no', verifyToken, C_TTAX0040A.select);
router.post('/set', verifyToken, C_TTAX0040A.insert);
router.post('/set/:apply_no', verifyToken, C_TTAX0040A.update);
router.get('/del/:apply_no', verifyToken, C_TTAX0040A.delete);

module.exports = router;
