const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const { sendSMSFromTemplate } = require('../config/aligosms');
const { sendMailFromTemplete } = require('../config/smtpTransport');

const Template = require('../models/template');
const { Console } = require('winston/lib/winston/transports');

const ejs = require('ejs');

module.exports = {
  select: async function (req, res, next) {
    try {
      S;
      if (!req.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await Template.select(req.params);

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
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await Template.selectList(req.body.params);

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
      const result = await Template.insert(req.body.params);

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
      const result = await Template.update(req.body.params);

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
      const result = await Template.delete(req.body.params);

      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.DELETE
        });
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * 회원가입 문자발송
   *
   * @param {t_id, send_type, user_nm} params
   * @returns
   */
  sendTemplete: async function (req, res, params) {
    // return false;
    try {
      const result = await Template.select(params);
      logger.debug('TemplateControllers sendTemplete result : ', result);
      logger.debug('TemplateControllers sendTemplete params : ', params);
      const templateParmas = result[0];

      if (result) {
        templateParmas.to = params.to;

        switch (params.t_id) {
          case 'CS0210':
            templateParmas.contents = ejs.render(templateParmas?.contents, { user_nm: params.user_nm });
            break;
          case 'CM0100': // [회원가입] 회원가입안내
            templateParmas.contents = ejs.render(templateParmas?.contents, {
              user_nm: params.user_nm,
              user_id: params.user_id,
              created_at: params.created_at
            });
            break;
          case 'CM0210': // [보험가입] 보험가입 안내메일
            templateParmas.contents = ejs.render(templateParmas?.contents, {
              user_nm: params.user_nm,
              user_id: params.user_id,
              created_at: params.created_at
            });
            break;

          case 'CM0110': // [법인 비밀번호찾기] 법인 인증문자 발송
            templateParmas.contents = ejs.render(templateParmas?.contents, {
              auth_code: params.auth_code,
              created_at: params.created_at
            });
            break;

          default:
            break;
        }

        // 메일발송
        if (result[0].send_type == 'M') {
          sendMailFromTemplete(templateParmas);
          // 문자발송
        } else if (result[0].send_type == 'S') {
          sendSMSFromTemplate(req, res, templateParmas);
        }
        return true;
      } else {
        logger.error('templateController resultTemplate 조회 오류 ');
      }

      return templateParmas;
    } catch (err) {
      logger.error('sendTemplete error : ' + err);
      return null;
    }

    return null;
  }
};
