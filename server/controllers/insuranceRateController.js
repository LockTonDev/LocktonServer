const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const InsuranceRate = require('../models/insuranceRate');

module.exports = {
  select: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await InsuranceRate.select(req.body.params);

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
  selectTop: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await InsuranceRate.selectTop(req.body.params);

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
      const result = await InsuranceRate.insert(req.body.params);

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
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await InsuranceRate.update(req.body.params);

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
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await InsuranceRate.delete(req.body.params);

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
