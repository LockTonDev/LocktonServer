const EmailLogController = require('../controllers/emailLogController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

//router.get('/:t_id', EmailLogController.test);

module.exports = router;
