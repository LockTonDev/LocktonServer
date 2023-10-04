const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const UserCustoms = require('../models/userCustoms');

module.exports = {
  select: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await UserCustoms.select(req.body.params);

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

  /**
   * 등록번호 등록유무 확인
   */
  isVerifyUserRegNo: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await UserCustoms.isVerifyUserRegNo(req.body.params);

      res.status(StatusCode.OK).json({
        success: result,
        message: result ? StatusMessage.VERITY_OK : StatusMessage.VERITY_FAILED
      });
    } catch (err) {
      next(err);
    }
  },

  insert: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await UserCustoms.insert(req.body.params);

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
      const result = await UserCustoms.update(req.body.params);

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
      const result = await UserCustoms.delete(req.body.params);

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
