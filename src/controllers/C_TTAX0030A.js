const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');

const M_TTAX0030A = require('../models/M_TTAX0030A');
const user = require('../models/user');
const TemplateController = require('./templateController');
const dayjs = require('dayjs');

module.exports = {
  /**
   * 보험관리 - 상세조회 1건
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  selectExcelList: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.selectExcelList(req);

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
   * 보험관리 - 상세조회 1건
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  select: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.select(req);

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
   * 보험관리 - 이력 목록 조회
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  selectHistory: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.selectHistory(req);

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
   * 보험관리 - 보험상태 조회
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  selectStatus: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.selectStatus(req);

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
   * 보험관리 - 보험목록 조회
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  selectList: async function (req, res, next) {
    try {
      const result = await M_TTAX0030A.selectList(req);

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

  /**
   * 보험관리 - 신규가입
   *
   *  1. 신규가입
   *  2. 가입안내 발송(문자 OR 메일)
   *  3. 보험 가입정보 -> 회원정보 업데이트
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  insert: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      // 중복확인
      const chkDupParams = await M_TTAX0030A.chkDup(req);

      if (chkDupParams !== null) {
        res.status(StatusCode.CREATED).json({
          success: false,
          message: StatusMessage.DUPLICATION_FAILED,
          data: null
        });
      } else {
        const result = await M_TTAX0030A.insert(req);
        await M_TTAX0030A.updateRenewalState(req);
        if (result) {
          try {
            // 1. 문자발송 - 보험가입[CS0210]
            const templateParams1 = {
              t_id: 'CS0210',
              to: req.body.params.corp_cust_hpno,
              user_nm: req.body.params.user_nm
            };
            const templeteRet1 = TemplateController.sendTemplete(req, res, templateParams1);
          } catch (e) {
            logger.error(' 1. 문자발송 - 보험가입[CS0210]');
            logger.error(e);
            next(e);
          }
          try {
            // 1. 메일발송 - 보험가입[CM0210]
            const templateParams2 = {
              t_id: 'CM0210',
              to: req.body.params.corp_cust_email,
              user_nm: req.body.params.user_nm,
              user_id: req.body.params.user_id,
              created_at: dayjs().format('YYYY-MM-DD')
            };
            const templeteRet2 = TemplateController.sendTemplete(req, res, templateParams2);
          } catch (e) {
            logger.error(' 1. 메일발송 - 보험가입[CM0210]');
            logger.error(e);
            next(e);
          }
          // 2. 보험정보에서 USER_UUID 업데이트

          // 3. USER_UUID 로 보험정보 업데이트
          const resultUser = await user.updateFromInsurance(req);
          logger.debug(resultUser);
          res.status(StatusCode.CREATED).json({
            success: true,
            message: StatusMessage.INSERT,
            data: result
          });
        }
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * 보험관리 - 수정
   *
   *  1. 보험정보 수정
   *  2. 기존 보험정보 있을 경우 회원정보 -> 가입정보 업데이트
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  update: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await M_TTAX0030A.update(req);

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

  updateFromUserInfo: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await M_TTAX0030A.updateFromUserInfo(req);
      return result;
    } catch (err) {
      next(err);
    }
  },
  updateUserInfo: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await M_TTAX0030A.updateUserInfo(req);

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

  /**
   * 보험관리 - 보험삭제
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);
      const result = await M_TTAX0030A.delete(req);

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
