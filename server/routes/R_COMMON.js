const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

const C_COMMON = require('../controllers/C_COMMON');

router.post('/code/get', C_COMMON.getCode);
router.post('/code/all', C_COMMON.getCodeALL);

module.exports = router;
