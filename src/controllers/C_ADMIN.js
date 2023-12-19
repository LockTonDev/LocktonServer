const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const bcrypt = require('bcryptjs');

const M_ADMIN = require('../models/M_ADMIN');
const M_ADMIN_ADV = require('../models/M_ADMIN_ADV')
const M_ADMIN_CAA = require('../models/M_ADMIN_CAA')
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
  setUserPassword: async function (req, res, next) {
    try {
      const params = req.body.params;
      const hash_password = bcrypt.hashSync(params.rmk, 10);
      params.user_pwd = hash_password;
      console.log("params", params)
      const result = await M_ADMIN.setUserPassword(params);

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
      let errMessage = "등록번호 등록 중 오류가 발생했습니다."
      if (err.code == 'ER_DUP_ENTRY') {
        errMessage = "DUP"
      }
      res.status(StatusCode.OK).json({
        success: false,
        message: errMessage
      });


     // next(err);
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

      result.map(row => {
        row.user_birth = parseFloat(row.user_birth)
        row.user_regno = parseFloat(row.user_regno)
        row.insr_amt = parseFloat(row.insr_amt)
        row.insr_tot_amt = parseFloat(row.insr_tot_amt)
        row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
        row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
        row.insr_base_amt = parseFloat(row.insr_base_amt)
        row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
      })

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
  },

  getADV: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_ADV.getADV(req);

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

  getADVS: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_ADV.getADVS(req);

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

  getADVRate: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_ADV.getADVRate(req);

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

  getADVRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.getADVRenewal(req);

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
  getADVRenewals: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.getADVRenewals(req);
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

  setADV: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.setADV(req);

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

  setADVRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.setADVRenewal(req);

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

  getADV_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.getADV_TRX(req);

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

  setADV_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.setADV_TRX(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      console.log("========================== setADV_TRX  ==========================")
      next(err);
    }
  },
  getApplyADVInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.getApplyADVInsurance(req);

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
  setApplyADVInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.setApplyADVInsurance(req);

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
  getADVExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN_ADV.getADVExcel(req);

      result.map(row => {
        row.user_birth = parseFloat(row.user_birth)
        row.user_regno = parseFloat(row.user_regno)
        row.insr_amt = parseFloat(row.insr_amt)
        row.insr_tot_amt = parseFloat(row.insr_tot_amt)
        row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
        row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
        row.insr_base_amt = parseFloat(row.insr_base_amt)
        row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
      })

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

  getCAA: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_CAA.getCAA(req);

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

  getCAAS: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_CAA.getCAAS(req);

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

  getCAARate: async function (req, res, next) {
    try {
      console.log(req)
      const result = await M_ADMIN_CAA.getCAARate(req);

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

  getCAARenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.getCAARenewal(req);

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
  getCAARenewals: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.getCAARenewals(req);
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

  setCAA: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.setCAA(req);

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

  setCAARenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.setCAARenewal(req);

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

  getCAA_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.getCAA_TRX(req);

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

  setCAA_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.setCAA_TRX(req);

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
  getApplyCAAInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.getApplyCAAInsurance(req);

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
  setApplyCAAInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.setApplyCAAInsurance(req);

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
  getCAAExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.getCAAExcel(req);

      result.map(row => {
        row.user_birth = parseFloat(row.user_birth)
        row.user_regno = parseFloat(row.user_regno)
        row.insr_amt = parseFloat(row.insr_amt)
        row.insr_tot_amt = parseFloat(row.insr_tot_amt)
        row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
        row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
        row.insr_base_amt = parseFloat(row.insr_base_amt)
        row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
      })

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

  
  getStockStartDtInfo : async function (req, res, next) {
    try {
      const result = await M_ADMIN.getStockStartDtInfo(req);
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
  
};
