const logger = require('../config/winston');
const passport = require('passport');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { StatusCode, StatusMessage } = require('../utils/response');
const { NotFound, BadRequest, Conflict } = require('../utils/errors');

const crypto = require('crypto'); // npm built-in module
const M_TTAX0030A = require('../models/M_TTAX0030A');

const TAG = 'authController  ';
const expiresInMinutes = process.env.NODE_ENV === 'dev' ? 30 : 30; // 만료 시간을 분 단위로 설정

module.exports = {
  checkEmail: async function (req, res, next) {
    try {
      if (!req.body.email) {
        throw new BadRequest(StatusMessage.BadRequestMeg);
      }
      await User.validateEmail(req).then(isValidate => {
        if (!isValidate) {
          return res.status(StatusCode.OK).json({
            success: true,
            message: StatusMessage.unValidateEmail
          });
        } else {
          throw new Conflict(StatusMessage.validateEmail);
        }
      });
    } catch (err) {
      next(err);
    }
  },
  signUp: async function (req, res, next) {
    try {
      if (!req.body.user_id || !req.body.user_pwd) {
        throw new BadRequest(StatusMessage.BadRequestMeg);
      }

      await User.signUp(req).then(() => {
        passport.authenticate('local', { session: false }, (err, user) => {
          if (err || !user) {
            logger.info(TAG + err || !user);
            return res.status(StatusCode.CREATED).json({
              success: false,
              message: StatusMessage.loginFailedAfterSuccessSignUp
            });
          }
          req.login(user, { session: false }, err => {
            if (err) {
              next(err);
            }
            const token = jwt.sign(user[0].user_id, process.env.JWT_SECRET_KEY);
            const tempNickname = getRandomNickname();
            return res.status(StatusCode.CREATED).json({
              success: true,
              message: StatusMessage.loginSuccessAfterSuccessSignUp,
              data: { token, tempNickname }
            });
          });
        })(req, res);
      });
    } catch (err) {
      next(err);
    }
  },

  signIn: async function (req, res, next) {
    try {
      const userInfo = req.user[0];
      const payload = {
        uuid: userInfo.user_uuid,
        role: 'user'
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: expiresInMinutes * 60 // expiresIn은 초 단위로 설정해야 함
      });

      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '1d' // 일
      });

      // logger.info(accessToken);
      logger.debug(userInfo);
      if (userInfo.login_block_yn === 'Y') {
        return res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.PASSWORD_CNT_FAILED,
          data: null
        });
      } else {
        return res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.loginSuccess,
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userInfo.user_id,
            userNm: userInfo.user_nm,
            userCd: userInfo.user_cd,
            businessCd: userInfo.business_cd,
            statusCd: userInfo.status_cd
          }
        });
      }

      // if (!req.body.user_id || !req.body.user_pwd) {
      //   return res.status(StatusCode.BADREQUEST).json({
      //     success: false,
      //     message: StatusMessage.BadRequestMeg
      //   });
      // }
      /*
      const retUser = await User.signIn(req.body.userInfo);

      // 비밀번호 검증
      var isPwdValid = bcrypt.compareSync(req.body.userInfo.USER_PWD, retUser[0].USER_PWD);

      if (!isPwdValid) {
        return res.status(StatusCode.BADREQUEST).json({
          success: false,
          message: StatusMessage.loginFailed
        });
      }

      var token = jwt.sign({ id: retUser[0].USER_ID }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: StatusMessage.loginSuccess,
        data: { token }
      });

      */
      /*
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
      */
    } catch (err) {
      logger.info('Error:' + err);
      next(err);
    }
  },

  refreshSignIn: async function (req, res, next) {
    try {

      const userInfo = req.body.params;
      const payload = {
        uuid: userInfo.userUuid,
        role: 'user'
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: expiresInMinutes * 60 // expiresIn은 초 단위로 설정해야 함
      });

      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '1d' // 일
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: StatusMessage.loginSuccess,
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      });
    } catch (err) {
      logger.info('Error:', err);
      next(err);
    }
  },
  sendMail: async function (req, res, next) {
    try {
      if (!req.body.email) {
        throw new BadRequest(StatusMessage.BadRequestMeg);
      }

      const isValidate = await User.validateEmail(req);
      if (isValidate.success && isValidate.isActive) {
        const verificationCode = sendMailForCertified(req.body.email);
        logger.info(StatusMessage.sendMailForCertifiedNumber);
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: StatusMessage.sendMailForCertifiedNumber,
          data: { verificationCode }
        });
      } else {
        if (!isValidate.success) {
          throw new NotFound(StatusMessage.unValidateUser);
        }
      }
    } catch (err) {
      next(err);
    }
  },

  restartSignIn: async function (req, res, next) {
    try {
      if (!req.body.verify && !req.body.email) {
        throw new BadRequest(StatusMessage.BadRequestMeg);
      }
      const isVerify = req.body.verify;
      if (isVerify) {
        await User.signIn(req).then(result => {
          const token = jwt.sign(result[0].user_id, process.env.JWT_SECRET_KEY);

          return res.status(StatusCode.OK).json({
            success: true,
            message: StatusMessage.loginSuccess,
            data: {
              token
            }
          });
        });
      } else {
        throw new NotFound(StatusMessage.unValidateVerificationCode);
      }
    } catch (err) {
      next(err);
    }
  },

  getAuthIMPortWithUser: async function (req, res, next) {
    try {
      const imp_uid = req.params.imp_uid;
      // logger.debug('imp_uid : ' + imp_uid);
      try {
        // 인증 토큰 발급 받기
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
          imp_key: '8646443225016826', // REST API키
          imp_secret: 'fKJNZ2a2xRe6gsrSnmf628ByFYT0oH6NotcKLOmiwGda5fJqYoBgN6XEmKvwUGtW1ThAPMEnPIbnk3Eq' // REST API Secret
        });

        const access_token = getToken.data.response.access_token; // 인증 토큰
        // logger.debug('access_token : ' + access_token);

        if (access_token) {
          const getAuth = await axios.get(`https://api.iamport.kr/certifications/${imp_uid}`, {
            headers: { Authorization: access_token }
          });

          const authInfo = getAuth.data.response;
          // logger.debug('getCertifications.data : ', authInfo);

          const user_nm = authInfo.name;
          const user_birth = authInfo.birthday.replace(/-/g, '').substring(2);
          const user_hpno = authInfo.phone.replace(/^01([0|1|6|7|8|9])(\d{3,4})(\d{4})$/, '010-$2-$3');

          const params = { user_nm: user_nm, user_birth: user_birth, user_hpno: user_hpno };
          const isVerifyUser = await User.isVerifyUser(params);
          logger.debug(isVerifyUser);
          // 없는 회원이면 휴대폰 정보 전달
          if (isVerifyUser === null) {
            return res.status(StatusCode.OK).json({
              success: true,
              message: StatusMessage.VERITY_OK,
              data: authInfo
            });

            // 중복회원이 이면 중복오류메세지
          } else {
            //
            return res.status(StatusCode.OK).json({
              success: false,
              message: StatusMessage.DUPLICATION_FAILED,
              data: null
            });
          }
        }
      } catch (err) {
        logger.error(err);
        return res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED,
          data: null
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getAuthIMPort: async function (req, res, next) {
    try {
      const imp_uid = req.params.imp_uid;
      logger.debug('imp_uid', imp_uid);
      try {
        // 인증 토큰 발급 받기
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
          imp_key: '8646443225016826', // REST API키
          imp_secret: 'fKJNZ2a2xRe6gsrSnmf628ByFYT0oH6NotcKLOmiwGda5fJqYoBgN6XEmKvwUGtW1ThAPMEnPIbnk3Eq' // REST API Secret
        });

        const access_token = getToken.data.response.access_token; // 인증 토큰
        logger.debug('access_token', access_token);

        if (access_token) {
          const getAuth = await axios.get(`https://api.iamport.kr/certifications/${imp_uid}`, {
            headers: { Authorization: access_token }
          });

          const authInfo = getAuth.data.response;
          //logger.debug('getCertifications.data', authInfo);

          return res.status(StatusCode.OK).json({
            success: true,
            message: StatusMessage.VERITY_OK,
            data: authInfo
          });
        }
      } catch (err) {
        return res.status(StatusCode.OK).json({
          success: false,
          message: StatusMessage.VERITY_FAILED,
          data: null
        });
      }
    } catch (err) {
      next(err);
    }
  }
};
