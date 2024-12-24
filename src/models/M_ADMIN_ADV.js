const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const knexDB = require('../config/knexDB');
const ADVAdminMapper = require('../mapper/ADVAdminMapper');
const AdminUserMapper = require('../mapper/AdminUserMapper');
const AdminBoardMapper = require('../mapper/AdminBoardMapper');
const AdminMapper = require("../mapper/AdminMapper");

module.exports = {
  getADV: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.insurance_uuid
    ];

    const [rowsInsrInfo] = await db.query(ADVAdminMapper.INSURANCE_ADV_INFO, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getADVS: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.user_nm,
      params.user_nm,
    ];


    const [rowsInsrInfo] = await db.query(ADVAdminMapper.INSURANCE_ADV_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getADVRate: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.user_cd,
      params.business_cd,
    ];
    const [rowsInsrInfo] = await db.query(ADVAdminMapper.INSURANCE_ADV_RATE_TOP, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getADVRenewal: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.insurance_uuid
    ];
    const [rowsInsrInfo] = await db.query(ADVAdminMapper.RENEWAL_INSURANCE_ADV_INFO, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getADVRenewals: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.renewal_yn,
      params.status_cd,
      params.user_nm,
      params.user_nm,
    ];

    const [rowsInsrInfo] = await db.query(ADVAdminMapper.RENEWAL_INSURANCE_ADV_LIST, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },
  
  setADV: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    logger.info(user_uuid)
    logger.info(params)
    let querys = []
    let query_params = []
    for(const param of params){
      if (param.mode === 'C') {
        const insert_params = [
          param.user_uuid, param.insurance_no,param.business_cd,param.user_cd,
          param.user_id,param.user_nm,param.user_birth,param.user_regno,param.corp_type,
          param.corp_nm,param.corp_bnno,param.corp_cnno,param.corp_telno,param.corp_faxno,
          param.corp_cust_nm,param.corp_cust_hpno,param.corp_cust_email,param.corp_post,param.corp_addr,
          param.corp_addr_dtl,param.corp_region_cd,param.insr_year,param.insr_reg_dt,param.insr_st_dt,
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_take_amt,param.insr_take_sec,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk,param.erp_amt,
          param.erp_dt,param.erp_st_dt,param.erp_cncls_dt,param.change_rmk,param.change_dt,
          param.created_id,param.created_ip,param.updated_id,param.updated_ip,
          param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data),param.limited_collateral
        ]
        querys.push(ADVAdminMapper.INSERT_ADV_INSURANCE)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        const update_params = [
          param.insurance_no, param.business_cd, param.user_cd, param.user_id, param.user_nm, param.user_birth,
          param.user_regno, param.corp_type, param.corp_nm, param.corp_ceo_nm, param.corp_bnno, param.corp_cnno,
          param.corp_telno, param.corp_faxno, param.corp_cust_nm, param.corp_cust_hpno, param.corp_cust_email,
          param.corp_post, param.corp_addr, param.corp_addr_dtl, param.corp_region_cd, param.insr_year, param.insr_reg_dt,
          param.insr_st_dt, param.insr_cncls_dt, param.insr_retr_yn, param.insr_retr_dt, param.insr_take_amt, param.insr_take_sec,
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.erp_amt, param.erp_dt, param.erp_st_dt, param.erp_cncls_dt,
          param.change_rmk, param.change_dt, param.updated_id, param.updated_ip, param.limited_collateral, param.insurance_uuid 
        ]
        querys.push(ADVAdminMapper.UPDATE_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid, param.user_uuid
        ]
        querys.push(ADVAdminMapper.DELETE_ADV_INSURANCE)
        query_params.push(delete_params)
      }
    }

    logger.debug(query_params);
    const rows_results = await db.queryListWithTransaction(querys, query_params);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    for(const rows of rows_results){
      if (rows.affectedRows < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
    }
    return true;
  },

  setADVRenewal: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    logger.info(user_uuid)
    logger.info(params)
    let querys = []
    let query_params = []
    for(const param of params){
      if (param.mode === 'C') {
        const insert_params = [
          param.user_uuid, param.insurance_no,param.business_cd,param.user_cd,
          param.user_id,param.user_nm,param.user_birth,param.user_regno,param.corp_type,
          param.corp_nm,param.corp_bnno,param.corp_cnno,param.corp_telno,param.corp_faxno,
          param.corp_cust_nm,param.corp_cust_hpno,param.corp_cust_email,param.corp_post,param.corp_addr,
          param.corp_addr_dtl,param.corp_region_cd,param.insr_year,param.insr_reg_dt,param.insr_st_dt,
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_take_amt,param.insr_take_sec,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk, param.change_rmk,
          param.change_dt,param.created_id,param.created_ip,param.updated_id,
          param.updated_ip,param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data),JSON.stringify(param.trx_data)
        ]
        querys.push(ADVAdminMapper.INSERT_RENEWAL_ADV_INSURANCE)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        logger.info(params)
        const update_params = [
          param.insurance_no, param.business_cd, param.user_cd, param.user_id, param.user_nm, param.user_birth,
          param.user_regno, param.corp_type, param.corp_nm, param.corp_ceo_nm, param.corp_bnno, param.corp_cnno,
          param.corp_telno, param.corp_faxno, param.corp_cust_nm, param.corp_cust_hpno, param.corp_cust_email,
          param.corp_post, param.corp_addr, param.corp_addr_dtl, param.corp_region_cd, param.insr_year, param.insr_reg_dt,
          param.insr_st_dt, param.insr_cncls_dt, param.insr_retr_yn, param.insr_retr_dt, param.insr_take_amt, param.insr_take_sec,
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.change_rmk, param.change_dt, param.updated_id, param.updated_ip, param.insurance_uuid 
        ]
        querys.push(ADVAdminMapper.UPDATE_RENEWAL_ADV_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid
        ]
        querys.push(ADVAdminMapper.DELETE_RENEWAL_ADV_INSURANCE)
        query_params.push(delete_params)
      }
    }
    const rows_results = await db.queryListWithTransaction(querys, query_params);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    for(const rows of rows_results){
      if (rows.affectedRows < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
    }
    return true;
  },


  getApplyADVInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.proc_cd,
      params.proc_cd,
      params.user_nm
    ];
    const [rowsInsrInfo] = await db.query(ADVAdminMapper.SELECT_APPLY_ADV_INSURANCE_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setApplyADVInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.proc_dt,
      params.proc_content,
      params.proc_cd,
      params.apply_no,
    ];
    
    const [rows] = await db.query(ADVAdminMapper.UPDATE_APPLY_ADV_INSURANCE, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return true;
  },

  getADV_TRX: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.user_nm,
      params.user_nm,
    ];
    const [rowsInsrInfo] = await db.query(ADVAdminMapper.SELECT_INSURANCE_ADV_TRX_DATA_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setADV_TRX: async function (req) {
    const { params } = req.body;
    //logger.error(params);
    let nCnt = 0;
    // for(const param of params){
    //   //총입금액이 '' 일경우 오류, null로 변경 2024-07-04
    //   if(param.insr_tot_paid_amt == '') param.insr_tot_paid_amt = null
    //   const updateQueryParams = [
    //     JSON.stringify(param.trx_data),
    //     param.insr_tot_unpaid_amt,
    //     param.insr_tot_paid_amt,
    //     param.status_cd,
    //     param.updated_id,
    //     param.updated_ip,
    //     param.insurance_uuid,
    //   ];
    //   querys.push(ADVAdminMapper.UPDATE_INSURANCE_ADV_TRX_DATA)
    //   query_params.push(updateQueryParams)
    //   nCnt ++
    // }
    // const rows_results = await db.queryListWithTransaction(querys, query_params);
    // //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    // for(const rows of rows_results){
    //   if (rows.affectedRows < 1) {
    //     throw new NotFound(StatusMessage.SELECT_FAILED);
    //   }
    // }

    let transaction;
    try {
      transaction = await knexDB.transaction();

      for (const param of params) {

        //총입금액이 '' 일경우 오류, null로 변경 2024-07-04
        if(param.insr_tot_paid_amt == '') param.insr_tot_paid_amt = null
        param.trx_data = JSON.stringify(param.trx_data);
        logger.info('insr_tot_paid_amt: '+param.insr_tot_paid_amt+ 'insr_tot_unpaid_amt: '+
            param.insr_tot_unpaid_amt+ ' insr_tot_paid_amt: '+
            param.insr_tot_paid_amt+ ' status_cd: '+
            param.status_cd+ ' updated_id: '+
            param.updated_id+ ' updated_ip: '+
            param.updated_ip+ ' trx_data: '+
            param.trx_data+ ' insurance_uuid: '+
            param.insurance_uuid
        )
        await transaction.raw(ADVAdminMapper.UPDATE_INSURANCE_ADV_TRX_DATA, param);
        nCnt++;
      }
      await transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return nCnt;
  },

  getADVExcel: async function (req) {
    const params = req.body.params;
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.user_nm,
    ];
    const [rows] = await db.query(ADVAdminMapper.INSURANCE_ADV_EXCEL_LIST, queryParams);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return rows;
  },

};
