const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const bcrypt = require('bcryptjs');

const M_ADMIN = require('../models/M_ADMIN');
const { genPassword } = require('../utils/util');

module.exports = {
  getSystemInfo: async function (req, res, next) {
    try {
      const systemInfo = {
        SMTP_USE_YN: process.env.SMTP_USE_YN,
        ALIGO_SMS_USE_YN: process.env.ALIGO_SMS_USE_YN,
        NODE_ENV: process.env.NODE_ENV
      };

      res.status(StatusCode.OK).json({
        success: true,
        message: StatusMessage.SELECT,
        data: systemInfo
      });
    } catch (err) {
      next(err);
    }
  },

  getApplyInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getApplyInsurance(req);

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
  setApplyInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setApplyInsurance(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getUserRegNo: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getUserRegNo(req);

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
  setUserRegNo: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setUserRegNo(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getBoardInfo: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getBoardInfo(req);

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

  getBoardList: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getBoardList(req);

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
  setInsertBoard: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setInsertBoard(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.INSERT_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setUpdateBoard: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setUpdateBoard(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setDeleteBoard: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setDeleteBoard(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.DELETE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getUserInfo: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getUserInfo(req);

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

  getUserList: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getUserList(req);

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

  setUserLoginBlockReset: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setUserLoginBlockReset(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setUserInfo: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setUserInfo(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },
  setInsertUser: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setInsertUser(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.INSERT_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setUpdateUser: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setUpdateUser(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setDeleteUser: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setDeleteUser(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.DELETE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  setUsersTemp: async function (req, res, next) {
    try {
      const paramsList = req.body.params;

      // logger.debug(paramsList);
      // logger.debug(paramsList.length);
      let index = 0;
      for (const params of paramsList) {
        const hash_password = bcrypt.hashSync(params.rmk, 10);
        params.user_pwd = hash_password;
        // logger.debug(++index + ':' + params.user_pwd);
      }

      const result = await M_ADMIN.setUser(paramsList);

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
  getTAXRate: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getTAXRate(req);

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
  getTAX: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getTAX(req);

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
  getTAXS: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN.getTAXS(req);

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

  getTAXExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getTAXExcel(req);

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
  getTAX_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getTAX_TRX(req);

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

  setTAX_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setTAX_TRX(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getRenewal(req);

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
  getRenewals: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getRenewals(req);
      console.log("========================")
      console.log(result)
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

  setTAX: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setTAX(req);

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

  setTAXRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setTAXRenewal(req);

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

  setTAXTEST: async function (req, res, next) {
    try {
      const { taxData } = req.body;
      const methodName = 'setTAX';
      const method = M_ADMIN[methodName];
      const result = await method(taxData);

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

  setACCS: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setACCS(req);

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
  setACCSRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN.setACCSRenewal(req);

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
