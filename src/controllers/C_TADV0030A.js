const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');

const M_TADV0030A = require('../models/M_TADV0030A');
const user = require('../models/user');
const TemplateController = require('./templateController');

module.exports = {
  select: async function (req, res, next) {
    try {
      const result = await M_TADV0030A.select(req);

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
      const result = await M_TADV0030A.selectStatus(req);

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

  selectHistory: async function (req, res, next) {
    try {
      const result = await M_TADV0030A.selectHistory(req);

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
      const result = await M_TADV0030A.selectList(req);

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

  selectRenewalInfo: async function (req, res, next) {
    try {
      const result = await M_TADV0030A.selectRenewalInfo(req);

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
   * 할인할증 및 중복가입여부를 확인한다.
   *
   * 1. 할인할증률 조회 [갱신DB]
   * 2. 중복가입여부[보험DB] 확인
   *
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getSaleRtNDupInfo: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.getSaleRtNDupInfo(req);

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
      const result = await M_TADV0030A.insert(req);

      if (result) {
        // 문자발송 - 보험가입[CS0001]

        // const templateParams = { t_id: 'CS0001', to: req.body.params.user_hpno, user_nm: req.body.params.user_nm };
        // const templeteRet = TemplateController.sendTemplete(req, res, templateParams);
        const resultUser = await user.updateFromInsurance(req);
        logger.debug(resultUser);
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
      const result = await M_TADV0030A.update(req);

      const resultUser = await user.updateFromInsurance(req);
      logger.debug(resultUser);

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
      const result = await M_TADV0030A.delete(req);

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
