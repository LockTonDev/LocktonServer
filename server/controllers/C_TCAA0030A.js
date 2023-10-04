const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');

const M_TCAA0030A = require('../models/M_TCAA0030A');
const TemplateController = require('./templateController');

module.exports = {
  select: async function (req, res, next) {
    try {
      const result = await M_TCAA0030A.select(req);

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

  selectStatus: async function (req, res, next) {
    try {
      const result = await M_TCAA0030A.selectStatus(req);

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
      const result = await M_TCAA0030A.selectList(req);

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
      const result = await M_TCAA0030A.insert(req);

      if (result) {
        // 문자발송 - 보험가입[CS0001]

        // const templateParams = { t_id: 'CS0001', to: req.body.params.user_hpno, user_nm: req.body.params.user_nm };
        // const templeteRet = TemplateController.sendTemplete(req, res, templateParams);

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
      const result = await M_TCAA0030A.update(req);

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
      const result = await M_TCAA0030A.delete(req);

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
