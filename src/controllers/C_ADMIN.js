const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const { BadRequest } = require('../utils/errors');
const bcrypt = require('bcryptjs');

const M_ADMIN = require('../models/M_ADMIN');
const M_ADMIN_MASTER = require('../models/M_ADMIN_MASTER');
const M_ADMIN_ADV = require('../models/M_ADMIN_ADV')
const M_ADMIN_LAW = require('../models/M_ADMIN_LAW')
const M_ADMIN_CAA = require('../models/M_ADMIN_CAA')
const M_ADMIN_PAT = require('../models/M_ADMIN_PAT')
const { genPassword } = require('../utils/util');
const { downloadFile } = require('../utils/saveFile')
const encrypt = require('../config/encrypt')

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

  getRenwalInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getRenewalInsurance(req);

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
      // console.log("params", params)
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
      // req.body.params.user_nm = encrypt.getEncryptData(req.body.params.user_nm)
      // console.log(req.body.params.user_nm )
      const result = await M_ADMIN.getUserInfo(req);

      if (result) {
        result[0] =encrypt.decryptUserInfo(result[0]);
        // result[0].user_nm = encrypt.getDecryptData(result[0].user_nm)
        // result[0].user_hpno = encrypt.getDecryptData(result[0].user_hpno)
        // result[0].corp_telno = encrypt.getDecryptData(result[0].corp_telno)
        // result[0].user_email = encrypt.getDecryptData(result[0].user_email)
        // result[0].user_birth = encrypt.getDecryptData(result[0].user_birth)
        // result[0].corp_ceo_nm = encrypt.getDecryptData(result[0].corp_ceo_nm)
        // result[0].corp_cust_nm = encrypt.getDecryptData(result[0].corp_cust_nm)
        // result[0].corp_cust_hpno = encrypt.getDecryptData(result[0].corp_cust_hpno)
        // result[0].corp_cust_email = encrypt.getDecryptData(result[0].corp_cust_email)
        // console.log(result)
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
      // console.log(req.body )
       if(req.body.params.user_nm != "" && !req.body.params.user_nm) req.body.params.user_nm = encrypt.getEncryptData(req.body.params.user_nm)
       console.log(req.body.params.user_nm )

      const result = await M_ADMIN.getUserList(req);
      const tempResult = JSON.parse(JSON.stringify(result));

      if (result) {

        for(let i = 0 ; i < result.length ; i ++) {
          result[i] = encrypt.decryptUserInfo(result[i]);
          // tempResult[i].user_nm = encrypt.getEncryptData(result[i].user_nm)
          // tempResult[i].user_hpno = encrypt.getEncryptData(result[i].user_hpno)
          // tempResult[i].corp_telno = encrypt.getEncryptData(result[i].corp_telno)
          // tempResult[i].user_email = encrypt.getEncryptData(result[i].user_email)
          // tempResult[i].user_birth = encrypt.getEncryptData(result[i].user_birth)
          // tempResult[i].corp_ceo_nm = encrypt.getEncryptData(result[i].corp_ceo_nm)
          // tempResult[i].corp_cust_nm = encrypt.getEncryptData(result[i].corp_cust_nm)
          // tempResult[i].corp_cust_hpno = encrypt.getEncryptData(result[i].corp_cust_hpno)
          // tempResult[i].corp_cust_email = encrypt.getEncryptData(result[i].corp_cust_email)
          //
          // result[i].user_nm = encrypt.getDecryptData(result[i].user_nm)
          // result[i].user_hpno = encrypt.getDecryptData(result[i].user_hpno)
          // result[i].corp_telno = encrypt.getDecryptData(result[i].corp_telno)
          // result[i].user_email = encrypt.getDecryptData(result[i].user_email)
          // result[i].user_birth = encrypt.getDecryptData(result[i].user_birth)
          // result[i].corp_ceo_nm = encrypt.getDecryptData(result[i].corp_ceo_nm)
          // result[i].corp_cust_nm = encrypt.getDecryptData(result[i].corp_cust_nm)
          // result[i].corp_cust_hpno = encrypt.getDecryptData(result[i].corp_cust_hpno)
          // result[i].corp_cust_email = encrypt.getDecryptData(result[i].corp_cust_email)


        }
           await M_ADMIN.setUserEncrypt(tempResult)

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
      // console.log(req)
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
        row.trx_data.map(trx=>{
          trx.trx_amt = parseFloat(trx.trx_amt)
        })
        row.cbr_data.map(cbr=>{
          cbr.insr_amt = parseFloat(cbr.insr_amt)
        })
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
  
  getTAXRenewalExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getTAXRenewalExcel(req);

      // result.map(row => {
      //   row.user_birth = parseFloat(row.user_birth)
      //   row.user_regno = parseFloat(row.user_regno)
      //   row.insr_amt = parseFloat(row.insr_amt)
      //   row.insr_tot_amt = parseFloat(row.insr_tot_amt)
      //   row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
      //   row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
      //   row.insr_base_amt = parseFloat(row.insr_base_amt)
      //   row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
      //   row.trx_data.map(trx=>{
      //     trx.trx_amt = parseFloat(trx.trx_amt)
      //   })
      //   row.cbr_data.map(cbr=>{
      //     cbr.insr_amt = parseFloat(cbr.insr_amt)
      //   })
      // })

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
      // console.log(result)
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
      // console.log(req)
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
      // console.log(req)
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
      // console.log(req)
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
      logger.error("========================== setADV_TRX  ==========================")
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
        row.trx_data.map(trx=>{
          trx.trx_amt = parseFloat(trx.trx_amt)
        })
        row.cbr_data.map(cbr=>{
          cbr.insr_amt = parseFloat(cbr.insr_amt)
        })
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
      const result = await M_ADMIN_CAA.getCAA(req);

      logger.info("CAAAdminMapper.result>>> ")
      
      logger.info(result)
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
      // console.log(req)
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
      // console.log(req)
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
        if(row.trx_data) {
          row.trx_data.map(trx=>{
            trx.trx_amt = parseFloat(trx.trx_amt)
          })
        }
        row.cbr_data.map(cbr=>{
          cbr.insr_amt = parseFloat(cbr.insr_amt)
        })
      })

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: result
        });
      }
    } catch (err) {
      console.log(err)
      next(err);
    }
  },

  deleteCAA: async function (req, res, next) {
    try {
      const result = await M_ADMIN_CAA.deleteCAA(req);

      result.map(row => {
      })

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


  getPAT: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_PAT.getPAT(req);

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

  getPATS: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_PAT.getPATS(req);

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

  getPATRate: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_PAT.getPATRate(req);

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

  getPATRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.getPATRenewal(req);

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
  getPATRenewals: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.getPATRenewals(req);
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

  setPAT: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.setPAT(req);

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

  setPATRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.setPATRenewal(req);

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

  getPAT_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.getPAT_TRX(req);

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

  setPAT_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.setPAT_TRX(req);

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
  getApplyPATInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.getApplyPATInsurance(req);

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
  downloadIncomeFile: async function (req, res, next) {
    try {
      const [data, message] = downloadFile(req);
      
      if (data != null) {
        res.status(StatusCode.OK).json({
          success: true,
          message: message,
          data: data
        });
      }else {
        res.status(StatusCode.BADREQUEST).json({
          success: false,
          message: message,
          data: data
        });
      }
    } catch (err) {
      next(err);
    }
  },
  setApplyPATInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.setApplyPATInsurance(req);

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
  getPATExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN_PAT.getPATExcel(req);

      result.map(row => {
        row.user_birth = parseFloat(row.user_birth)
        row.user_regno = parseFloat(row.user_regno)
        row.insr_amt = parseFloat(row.insr_amt)
        row.insr_tot_amt = parseFloat(row.insr_tot_amt)
        row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
        row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
        row.insr_base_amt = parseFloat(row.insr_base_amt)
        row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
        row.trx_data.map(trx=>{
          trx.trx_amt = parseFloat(trx.trx_amt)
        })
        row.cbr_data.map(cbr=>{
          cbr.insr_amt = parseFloat(cbr.insr_amt)
        })
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

  getLAW: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_LAW.getLAW(req);

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

  getLAWS: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_LAW.getLAWS(req);

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

  getLAWRate: async function (req, res, next) {
    try {
      // console.log(req)
      const result = await M_ADMIN_LAW.getLAWRate(req);

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

  getLAWRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getLAWRenewal(req);

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
  getLAWRenewals: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getLAWRenewals(req);
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
  getLAWRenewalsExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getLAWRenewalsExcel(req);
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

  setLAW: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.setLAW(req);

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

  setLAWRenewal: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.setLAWRenewal(req);

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

  getLAW_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getLAW_TRX(req);

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

  setLAW_TRX: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.setLAW_TRX(req);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.UPDATE_OK,
          data: result
        });
      }
    } catch (err) {
      console.log("========================== setLAW_TRX  ==========================")
      next(err);
    }
  },
  getApplyLAWInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getApplyLAWInsurance(req);

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
  setApplyLAWInsurance: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.setApplyLAWInsurance(req);

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
  getLAWExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN_LAW.getLAWExcel(req);

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
  
  getInsuranceMaster: async function (req, res, next) {
    try {
      const result = await M_ADMIN_MASTER.getInsuranceMaster(req);

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


  getUserExcel: async function (req, res, next) {
    try {
      const result = await M_ADMIN.getUserExcel(req);

      // result.map(row => {
      //   row.user_birth = parseFloat(row.user_birth)
      //   row.user_regno = parseFloat(row.user_regno)
      //   row.insr_amt = parseFloat(row.insr_amt)
      //   row.insr_tot_amt = parseFloat(row.insr_tot_amt)
      //   row.insr_tot_paid_amt = parseFloat(row.insr_tot_paid_amt)
      //   row.insr_tot_unpaid_amt = parseFloat(row.insr_tot_unpaid_amt)
      //   row.insr_base_amt = parseFloat(row.insr_base_amt)
      //   row.insr_pcnt_sale_rt = parseFloat(row.insr_pcnt_sale_rt)
      // })

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
