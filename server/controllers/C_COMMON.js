const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');

const M_COMMON = require('../models/M_COMMON');

module.exports = {
  getCode: async function (req, res, next) {
    try {
      logger.debug(req.body);
      const result = await M_COMMON.getCode(req.body.params);

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
  getCodeALL: async function (req, res, next) {
    try {
      const result = await M_COMMON.getCodeALL();

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
  }
};
