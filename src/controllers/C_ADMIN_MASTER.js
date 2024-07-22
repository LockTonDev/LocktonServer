const logger = require('../config/winston');
const { StatusCode, StatusMessage } = require('../utils/response');
const M_ADMIN_MASTER = require('../models/M_ADMIN_MASTER');

module.exports = {
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
  setInsuranceMaster: async function (req, res, next) {
    try {
      logger.debug('setInsuranceMaster>>',req)
      const result = await M_ADMIN_MASTER.setInsuranceMaster(req);

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
  chkDupInsuranceMaster: async function (req, res, next) {
    try {
      const result = await M_ADMIN_MASTER.chkDupInsuranceMaster(req);
      console.log(result[0].cnt)
      if (result[0].cnt>0) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: {'dup':true}
        });
      }else{
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: {'dup':false}
        });
      }
    } catch (err) {
      next(err);
    }
  },
  chgInsuranceNo: async function (req, res, next) {
    try {
      let contractTable = "";
      let renewalTable = "";
      console.log('req.body.params.business_cd',req.body.params.business_cd)
      if(req.body.params.business_cd=='TAX' || req.body.params.business_cd=='ACC' ){
        contractTable = "ttax0030a";
        renewalTable = "ttax0031a";
      } else if(req.body.params.business_cd=='ADV' ) {
        contractTable = "tadv0030a";
        renewalTable = "tadv0031a";
      } else if(req.body.params.business_cd=='CAA' ) {
        contractTable = "tcaa0030a";
        renewalTable = "tcaa0031a";
      } else if(req.body.params.business_cd=='LAW' ) {
        contractTable = "tlaw0030a";
        renewalTable = "tlaw0031a";
      } else if(req.body.params.business_cd=='PAT' ) {
        contractTable = "tpat0030a";
        renewalTable = "tpat0031a";
      }
  
      //증권 마스터에 적용
      const result = await M_ADMIN_MASTER.updateInsuranceNoMaster(req.body.params,contractTable);
      //계약관리 테이블 업데이트
      const res0030 = await M_ADMIN_MASTER.updateContract0030a(req.body.params,contractTable);
      //갱신 테이블 업데이트
      const res0031 = await M_ADMIN_MASTER.updateRenewal0031a(req.body.params,renewalTable);

      if (result) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StatusMessage.SELECT,
          data: {'chg0030':res0030, 'chg0031':res0031 }
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
