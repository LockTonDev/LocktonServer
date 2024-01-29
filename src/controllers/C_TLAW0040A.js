const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const M_TLAW0040A = require('../models/M_TLAW0040A');

module.exports = {
  select: async function (req, res, next) {
    try {
      if (!req.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await M_TLAW0040A.select(req);

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

      const itemsData = await M_TLAW0040A.selectList(req);
      const countData = await M_TLAW0040A.selectCount(req);

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
  selectCount: async function (req, res, next) {
    try {
      if (!req.body) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await M_TLAW0040A.selectCount(req);

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

      const result = await M_TLAW0040A.insert(req);

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
      const result = await M_TLAW0040A.update(req);

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
      const result = await M_TLAW0040A.delete(req);

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
