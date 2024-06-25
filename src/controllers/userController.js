const logger = require('../config/winston');

const { BadRequest, NotFound } = require('../utils/errors');
const { StatusCode, StatusMessage } = require('../utils/response');
const { sendSMS } = require('../config/aligosms');
const { sendMail } = require('../config/smtpTransport');
const User = require('../models/user');
const M_TTAX0030A = require('../models/M_TTAX0030A');
const TemplateController = require('../controllers/templateController');
const dayjs = require('dayjs');

module.exports = {
  insert: async function (req, res, next) {
    logger.debug('userController params ', req.body.params);
    
    try {
      // 회원가입 저장
      const result = await User.insert(req.body.params);

      if(req.body.params.business_cd=='TAX'){
        
        //uuid 조회
        const user_uuid = await User.getUserUUID(req.body.params);
        req.body.params.user_uuid = user_uuid;

        //갱신 테이블 업데이트
        const res0030 = await User.updateTTAX0030a(req.body.params);

        //계약관리 테이블 업데이트
        const res0031 = await User.updateTTAX0031a(req.body.params);

        console.log('res0030',res0030)
        console.log('res0030',res0031)
      }
      

      if (result) {
        // 메일발송 - CM0100 / [록톤코리아] 회원가입이 완료되었습니다.
        const templateParams = {
          t_id: 'CM0100',
          to: req.body.params.user_email,
          user_nm: req.body.params.user_nm,
          user_id: req.body.params.user_id,
          created_at: dayjs().format('YYYY-MM-DD')
        };
        const templeteRet2 = TemplateController.sendTemplete(req, res, templateParams);

        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.INSERT_OK
        });
      }
    } catch (err) {
      next(err);
    }
  },
  update: async function (req, res, next) {
    try {
      let isVerifyPassword = false;

      if (req.body.params.ignore_chk_pw) {
        isVerifyPassword = true;
      } else {
        isVerifyPassword = await User.isVerifyPassword(req);
      }

      if (isVerifyPassword) {
        const result = await User.update(req);

        await M_TTAX0030A.updateFromUserInfo(req);

        // const templateParams = {
        //   t_id: 'CM0100',
        //   to: req.body.params.user_email,
        //   user_nm: req.body.params.user_nm,
        //   user_id: req.body.params.user_id,
        //   created_at: dayjs().format('YYYY-MM-DD')
        // };
        // const templeteRet2 = TemplateController.sendTemplete(req, res, templateParams);

        if (result) {
          res.status(StatusCode.CREATED).json({
            success: true,
            message: StatusMessage.UPDATE_OK
          });
        }
      } else {
        // 비밀번호 불일치
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_USERPWD_FAILED
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  select: async function (req, res, next) {
    await User.select(req)
      .then(result => {
        res.status(StatusCode.OK).json(result);
      })
      .catch(err => {
        next(err);
      });
  },

  updateUserPassword: async function (req, res, next) {
    try {
      const isVerifyPassword = await User.isVerifyPassword(req);

      if (isVerifyPassword) {
        const result = await User.updatePassword(req);

        if (result) {
          res.status(StatusCode.CREATED).json({
            success: true,
            message: StatusMessage.UPDATE_OK
          });
        }
      } else {
        // 비밀번호 불일치
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_USERPWD_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  },
  updatePasswordNotLogin: async function (req, res, next) {
    try {
      const result = await User.updatePasswordNotLogin(req);

      if (result) {
        res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.UPDATE_OK
        });
      }
    } catch (err) {
      next(err);
    }
  },

  delete: async function (req, res, next) {
    await User.deleteUser(req)
      .then(() => {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.userDelete
        });
      })
      .catch(err => {
        next(err);
      });
  },

  resignation: async function (req, res, next) {
    const isVerifyPassword = await User.isVerifyPassword(req);
    if (isVerifyPassword) {
      await User.resignation(req)
        .then(() => {
          res.status(StatusCode.OK).json({
            success: true,
            message: StatusMessage.RESIGNATION_OK
          });
        })
        .catch(err => {
          next(err);
        });
    } else {
      // 회원탈퇴시 비밀번호 오류
      res.status(StatusCode.OK).json({
        success: false,
        message: StatusMessage.VERITY_USERPWD_FAILED
      });
    }
  },

  /**
   *
   */
  isVerifyUser: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await User.isVerifyUser(req.body.params);

      res.status(StatusCode.OK).json({
        success: true,
        message: StatusMessage.SELECT_OK,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   *
   */
  isVerifyUserId: async function (req, res, next) {
    try {
      if (!req.body.params) throw new BadRequest(StatusMessage.BadRequestMeg);

      const result = await User.isVerifyUserId(req.body.params);

      res.status(StatusCode.OK).json({
        success: result,
        message: result ? StatusMessage.VERITY_USERID_OK : StatusMessage.VERITY_USERID_FAILED
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   *
   */
  isVerifyUserEMail: async function (req, res, next) {
    try {
      const result = await User.isVerifyUserEMail(req);

      res.status(StatusCode.OK).json({
        success: result,
        message: result ? StatusMessage.VERITY_EMAIL_OK : StatusMessage.VERITY_EMAIL_FAILED
      });
    } catch (err) {
      next(err);
    }
  },

  isVerifyPassword: async function (req, res, next) {
    try {
      const result = await User.isVerifyPassword(req);

      res.status(StatusCode.OK).json({
        success: result,
        message: result ? StatusMessage.VERITY_USERPWD_OK : StatusMessage.VERITY_USERPWD_FAILED
      });
    } catch (err) {
      next(err);
    }
  },

  isVerifyEMailAuthCode: async function (req, res, next) {
    try {
      const resultData = await User.isVerifyEMailAuthCode(req);
      logger.debug(resultData);
      if (resultData) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.VERITY_OK,
          data: resultData
        });
      } else {
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  },
  isVerifyUserUUID: async function (req, res, next) {
    try {
      const resultData = await User.isVerifyUserUUID(req);

      logger.debug(resultData);

      if (resultData) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.VERITY_OK,
          data: resultData
        });
      } else {
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getUserCd: async function (req, res, next) {
    try {
      const resultData = await User.getUserCd(req);

      logger.debug(resultData);

      if (resultData) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.VERITY_OK,
          data: resultData
        });
      } else {
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  },
  findCORUserNSendEMail: async function (req, res, next) {
    try {
      const resultData = await User.isVerifyUserEMail_COR(req);

      logger.debug(resultData);

      if (resultData.auth_code) {
        // 메일발송 - [CM0110] [록톤코리아] 비밀번호 찾기 이메일 인증 요청
        const templateParams = {
          t_id: 'CM0110',
          to: resultData.user_email,
          auth_code: resultData.auth_code,
          created_at: dayjs().format('YYYY-MM-DD')
        };

        const templeteRet = TemplateController.sendTemplete(req, res, templateParams);

        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.VERITY_OK
        });
      } else {
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  },
  findJNTUserNSendEMail: async function (req, res, next) {
    try {
      const resultData = await User.isVerifyUserEMail_JNT(req);

      logger.debug(resultData);

      if (resultData.auth_code) {
        // 메일발송 - [CM0110] [록톤코리아] 비밀번호 찾기 이메일 인증 요청
        const templateParams = {
          t_id: 'CM0110',
          to: resultData.user_email,
          auth_code: resultData.auth_code,
          created_at: dayjs().format('YYYY-MM-DD')
        };

        const templeteRet = TemplateController.sendTemplete(req, res, templateParams);

        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.VERITY_OK
        });
      } else {
        res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED
        });
      }
    } catch (err) {
      next(err);
    }
  }
};
