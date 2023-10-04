const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const EmailLog = require('../models/emailLog');
const { sendMail } = require('../config/smtpTransport');
const TemplateController = require('../controllers/templateController');
const { sendSMSFromTemplate } = require('../config/aligosms');

module.exports = {
  select: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await EmailLog.select(req.body.params);

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
      const result = await EmailLog.insert(req.body.params);

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

  delete: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await EmailLog.delete(req.body.params);

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
