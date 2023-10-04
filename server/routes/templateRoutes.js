const TemplateController = require('../controllers/templateController');
const express = require('express');
const router = new express.Router();

router.get('/:t_id', TemplateController.select);
router.post('/list', TemplateController.selectList);
router.post('/insert', TemplateController.insert);

module.exports = router;
