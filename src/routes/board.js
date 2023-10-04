const BoardController = require('../controllers/boardController');
const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = new express.Router();

router.post('/popup', BoardController.selectPopupList);
router.post('/faq/:board_id/', BoardController.selectList);
router.post('/:board_id', BoardController.selectList);
router.post('/:board_id/:board_no', BoardController.select);
router.post('/:board_id/count', BoardController.selectCount);
router.post('/:board_id/insert', BoardController.insert);
router.post('/:board_id/update', BoardController.update);
router.post('/:board_id/delete', BoardController.delete);

module.exports = router;
