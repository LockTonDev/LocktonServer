const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const Board = require('../models/board');

module.exports = {
  select: async function (req, res, next) {
    try {
      //if (!req.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await Board.select(req.body);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },
  selectList: async function (req, res, next) {
    try {
      if (!req.body) throw new BadRequest(StatusMessage.BadRequestMeg);
      logger.error('#################2');

      const itemsData = await Board.selectList(req.body);
      const countData = await Board.selectCount(req.body);

      if (itemsData) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: { items: itemsData, tot_count: countData }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  selectPopupList: async function (req, res, next) {
    try {
      if (!req.body) throw new BadRequest(StatusMessage.BadRequestMeg);

      const itemsData = await Board.selectPopupList(req.body);

      if (itemsData) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: { items: itemsData }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  selectCount: async function (req, res, next) {
    try {
      if (!req.body) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await Board.selectCount(req.body);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },
  insert: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await Board.insert(req.body.params);

      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.INSERT,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },
  update: async function (req, res, next) {
    try {
      // if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const { board_id } = req.params;
      const boardData = { ...req.body, board_id };
      await boardModel.update(boardData);

      const result = await Board.update(req.body.params);

      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.UPDATE
        });
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async function (req, res, next) {
    try {
      //if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await Board.delete(req.body.params);

      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.DELETE
        });
      }
    } catch (err) {
      next(err);
    }
  }
};
