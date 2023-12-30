const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const CAAAdminMapper = require('../mapper/CAAAdminMapper');

module.exports = {
  getCAA: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.insurance_uuid
    ];

    const [rowsInsrInfo] = await db.query(CAAAdminMapper.INSURANCE_CAA_INFO, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getCAAS: async function (req) {
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


    const [rowsInsrInfo] = await db.query(CAAAdminMapper.INSURANCE_CAA_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getCAARate: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.user_cd,
      params.business_cd,
    ];
    const [rowsInsrInfo] = await db.query(CAAAdminMapper.INSURANCE_CAA_RATE_TOP, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getCAARenewal: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.insurance_uuid
    ];
    const [rowsInsrInfo] = await db.query(CAAAdminMapper.RENEWAL_INSURANCE_CAA_INFO, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getCAARenewals: async function (req) {
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

    const [rowsInsrInfo] = await db.query(CAAAdminMapper.RENEWAL_INSURANCE_CAA_LIST, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },
  
  setCAA: async function (req) {
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
          param.corp_nm,param.corp_ceo_nm,param.corp_bnno,param.corp_cnno,param.corp_telno,param.corp_faxno,
          param.corp_cust_nm,param.corp_cust_hpno,param.corp_cust_email,param.corp_post,param.corp_addr,
          param.corp_addr_dtl,param.corp_region_cd,param.insr_year,param.insr_reg_dt,param.insr_st_dt,
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_pblc_brdn_rt,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk,param.erp_amt,
          param.erp_dt,param.erp_st_dt,param.erp_cncls_dt,param.change_rmk,param.change_dt,
          param.created_id,param.created_ip,param.updated_id,param.updated_ip,
          param.cons_join_yn,JSON.stringify(param.cons_data), param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data)
        ]
        querys.push(CAAAdminMapper.INSERT_CAA_INSURANCE)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        const update_params = [
          param.insurance_no, param.business_cd, param.user_cd, param.user_id, param.user_nm, param.user_birth,
          param.user_regno, param.corp_type, param.corp_nm, param.corp_ceo_nm, param.corp_bnno, param.corp_cnno,
          param.corp_telno, param.corp_faxno, param.corp_cust_nm, param.corp_cust_hpno, param.corp_cust_email,
          param.corp_post, param.corp_addr, param.corp_addr_dtl, param.corp_region_cd, param.insr_year, param.insr_reg_dt,
          param.insr_st_dt, param.insr_cncls_dt, param.insr_retr_yn, param.insr_retr_dt, param.insr_pblc_brdn_rt,
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.cons_join_yn, JSON.stringify(param.cons_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.erp_amt, param.erp_dt, param.erp_st_dt, param.erp_cncls_dt,
          param.change_rmk, param.change_dt, param.updated_id, param.updated_ip, param.insurance_uuid 
        ]
        querys.push(CAAAdminMapper.UPDATE_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid, param.user_uuid
        ]
        querys.push(CAAAdminMapper.DELETE_ADV_INSURANCE)
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

  setCAARenewal: async function (req) {
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
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_pblc_brdn_rt,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk, param.change_rmk,
          param.change_dt,param.created_id,param.created_ip,param.updated_id,
          param.updated_ip,param.cons_join_yn,JSON.stringify(param.cons_data),param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data),JSON.stringify(param.trx_data)
        ]
        querys.push(CAAAdminMapper.INSERT_RENEWAL_CAA_INSURANCE)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        logger.info(params)
        const update_params = [
          param.insurance_no, param.business_cd, param.user_cd, param.user_id, param.user_nm, param.user_birth,
          param.user_regno, param.corp_type, param.corp_nm, param.corp_ceo_nm, param.corp_bnno, param.corp_cnno,
          param.corp_telno, param.corp_faxno, param.corp_cust_nm, param.corp_cust_hpno, param.corp_cust_email,
          param.corp_post, param.corp_addr, param.corp_addr_dtl, param.corp_region_cd, param.insr_year, param.insr_reg_dt,
          param.insr_st_dt, param.insr_cncls_dt, param.insr_retr_yn, param.insr_retr_dt, param.insr_pblc_brdn_rt,
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.cons_join_yn, JSON.stringify(param.cons_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.change_rmk, param.change_dt, param.updated_id, param.updated_ip, param.insurance_uuid 
        ]
        querys.push(CAAAdminMapper.UPDATE_RENEWAL_CAA_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid
        ]
        querys.push(CAAAdminMapper.DELETE_RENEWAL_CAA_INSURANCE)
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


  getApplyCAAInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.proc_cd,
      params.proc_cd,
      params.user_nm
    ];
    const [rowsInsrInfo] = await db.query(CAAAdminMapper.SELECT_APPLY_CAA_INSURANCE_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setApplyCAAInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.proc_dt,
      params.proc_content,
      params.proc_cd,
      params.apply_no,
    ];
    
    const [rows] = await db.query(CAAAdminMapper.UPDATE_APPLY_CAA_INSURANCE, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return true;
  },

  getCAA_TRX: async function (req) {
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
    const [rowsInsrInfo] = await db.query(CAAAdminMapper.SELECT_INSURANCE_CAA_TRX_DATA_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setCAA_TRX: async function (req) {
    const params = req.body.params
    logger.info(params)
    let querys = []
    let query_params = []
    for(const param of params){
      if(param.insr_tot_paid_amt==''){
        param.insr_tot_paid_amt = 0
      }
      const updateQueryParams = [
        JSON.stringify(param.trx_data),
        param.insr_tot_unpaid_amt,
        param.insr_tot_paid_amt,
        param.status_cd,
        param.updated_id,
        param.updated_ip,
        param.insurance_uuid,
      ];
      querys.push(CAAAdminMapper.UPDATE_INSURANCE_CAA_TRX_DATA)
      query_params.push(updateQueryParams)
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

  getCAAExcel: async function (req) {
    const params = req.body.params;
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.user_nm,
    ];
    const [rows] = await db.query(CAAAdminMapper.INSURANCE_CAA_EXCEL_LIST, queryParams);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return rows;
  },

};
