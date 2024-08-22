const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const knexDB = require('../config/knexDB');
const LAWAdminMapper = require('../mapper/LAWAdminMapper');
const AdminUserMapper = require('../mapper/AdminUserMapper');
const AdminBoardMapper = require('../mapper/AdminBoardMapper');

module.exports = {
  getLAW: async function (req) {
    const params = req.body.params
    const queryParams = [params.insurance_uuid];

    const resultData = await db.query(LAWAdminMapper.INSURANCE_LAW_INFO, queryParams);
    const applyData = await db.query(LAWAdminMapper.INSURANCE_APPLY_LIST, queryParams);

    let result = {
      contractInfo : resultData[0][0],
      applyList :applyData[0]
    }

    return result;
  },

  getLAWS: async function (req) {
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
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.limit,
      params.offset,
    ];
    const totalParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
      params.keywords,
    ];


    const resultData = await db.query(LAWAdminMapper.INSURANCE_LAW_LIST, queryParams);
    const total = await db.query(LAWAdminMapper.INSURANCE_TOTAL, totalParams);
   // resultData[0].total = total[0][0].total
    let result = {
      list : resultData[0],
      total : total[0][0].total
    }
    return result;
  },

  getLAWRate: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.user_cd,
      params.business_cd,
    ];
    const [rowsInsrInfo] = await db.query(LAWAdminMapper.INSURANCE_LAW_RATE_TOP, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getLAWRenewal: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.insurance_uuid
    ];
    const [rowsInsrInfo] = await db.query(LAWAdminMapper.RENEWAL_INSURANCE_LAW_INFO, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  getLAWRenewals: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.renewal_cd,
      params.renewal_cd,
      params.user_nm,
      params.user_nm,
      params.limit,
      params.offset,
    ];
    const totalParams = [
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year,
      params.renewal_cd,
      params.renewal_cd,
      params.user_nm,
      params.user_nm,
    ];

    const resultData = await db.query(LAWAdminMapper.RENEWAL_INSURANCE_LAW_LIST, queryParams);
    const total = await db.query(LAWAdminMapper.RENEWAL_INSURANCE_TOTAL, totalParams);
    console.log('resultData',resultData)
    console.log('total',total)
    resultData[0].total = total[0][0].total
    let result = {
      list : resultData[0],
      total : total[0][0].total
    }
    return result;
  },
  
  getLAWRenewalsExcel: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.insr_year,
      params.renewal_cd,
      params.renewal_cd,
      params.user_nm,
      params.user_nm
    ];

    const [rowsInsrInfo] = await db.query(LAWAdminMapper.INSURANCE_RENEWAL_EXCEL_LIST, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setLAW: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    logger.info(user_uuid)
    logger.info(params)
    let querys = []
    let query_params = []
    for(const param of params){
      if(param.user_uuid==''){
        if(param.user_cd=='IND'){
          const sqlINDSelect = `SELECT user_uuid, user_id
                                  FROM TCOM0110A 
                                WHERE user_nm = ? 
                                  and user_regno = ? 
                                  and user_birth = ?
                                  and business_cd = ?
                                  and user_cd = ?
                                  and status_cd not in ('90')`;
          const select_params = [param.user_nm ,param.user_regno,param.user_birth,param.business_cd,param.user_cd]
          const [resultData] =   await knexDB.raw(sqlINDSelect, select_params);
          //console.log('[sqlINDSelect]',[resultData])
          if(resultData.length>0){
            param.user_uuid = resultData[0].user_uuid
            param.user_id = resultData[0].user_id
          }
        }else{
          const sqlJNTSelect = `SELECT user_uuid, user_id
                                  FROM TCOM0110A 
                                WHERE user_nm = ? 
                                  and corp_cnno = ?
                                  and business_cd = ?
                                  and user_cd = ?
                                  and status_cd not in ('90')`;
          const select_params = [param.user_nm ,param.corp_cnno,param.business_cd,param.user_cd]
          const [resultData] =   await knexDB.raw(sqlJNTSelect, select_params);
          //console.log('[sqlJNTSelect]',resultData.length)
          if(resultData.length>0){
            param.user_uuid = resultData[0].user_uuid
            param.user_id = resultData[0].user_id
          }
        }
        
      }
      if (param.mode === 'C') {
        const insert_params = [
          param.user_uuid, param.insurance_no,param.business_cd,param.user_cd,
          param.user_id,param.user_nm,param.user_birth,param.user_regno,param.corp_type,
          param.corp_nm,param.corp_bnno,param.corp_cnno,param.corp_telno,param.corp_faxno,
          param.corp_cust_nm,param.corp_cust_hpno,param.corp_cust_email,param.corp_post,param.corp_addr,
          param.corp_addr_dtl,param.corp_region_cd,param.insr_year,param.insr_reg_dt,param.insr_st_dt,
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_take_amt,param.insr_take_sec,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt, param.insr_relief,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk,param.erp_amt,
          param.erp_dt,param.erp_st_dt,param.erp_cncls_dt,param.change_rmk,param.change_dt,
          param.created_id,param.created_ip,param.updated_id,param.updated_ip,
          param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data),param.org_insr_year_clm_lt_amt,param.limited_collateral
        ]
        querys.push(LAWAdminMapper.INSERT_LAW_INSURANCE)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        const update_params = [
          param.insurance_no, param.business_cd, param.user_cd, param.user_uuid, param.user_id, param.user_nm, param.user_birth,
          param.user_regno, param.corp_type, param.corp_nm, param.corp_ceo_nm, param.corp_bnno, param.corp_cnno,
          param.corp_telno, param.corp_faxno, param.corp_cust_nm, param.corp_cust_hpno, param.corp_cust_email,
          param.corp_post, param.corp_addr, param.corp_addr_dtl, param.corp_region_cd, param.insr_year, param.insr_reg_dt,
          param.insr_st_dt, param.insr_cncls_dt, param.insr_retr_yn, param.insr_retr_dt, param.insr_take_amt, param.insr_take_sec,
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt, param.insr_relief,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.erp_amt, param.erp_dt, param.erp_st_dt, param.erp_cncls_dt,
          param.change_rmk, param.change_dt, param.updated_id, param.updated_ip,param.org_insr_year_clm_lt_amt,param.limited_collateral, param.insurance_uuid
        ]
        //console.log('update_params>>>',update_params)
        querys.push(LAWAdminMapper.UPDATE_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid, param.user_uuid
        ]
        querys.push(LAWAdminMapper.DELETE_LAW_INSURANCE)
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

  setLAWRenewal: async function (req) {
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
          param.insr_cncls_dt,param.insr_retr_yn,param.insr_retr_dt,param.insr_take_amt,param.insr_take_sec,
          param.insr_clm_lt_amt,param.insr_year_clm_lt_amt,param.insr_psnl_brdn_amt,param.insr_sale_year,param.insr_sale_rt, param.insr_relief,
          param.insr_pcnt_sale_rt,param.insr_base_amt,param.insr_amt,param.insr_tot_amt,param.insr_tot_paid_amt,
          param.insr_tot_unpaid_amt,param.active_yn,param.agr10_yn,param.agr20_yn,param.agr30_yn,
          param.agr31_yn,param.agr32_yn,param.agr33_yn,param.agr34_yn,param.agr40_yn,
          param.agr41_yn,param.agr50_yn,param.status_cd,param.rmk, param.change_rmk,
          param.change_dt,param.created_id,param.created_ip,param.updated_id,
          param.updated_ip,param.spct_join_yn,JSON.stringify(param.spct_data),param.cbr_cnt,JSON.stringify(param.cbr_data),JSON.stringify(param.trx_data), param.renewal_cd,param.org_insr_year_clm_lt_amt
        ]
        // console.log('insert_params>>>',insert_params)
        querys.push(LAWAdminMapper.INSERT_RENEWAL_LAW_INSURANCE)
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
          param.insr_clm_lt_amt, param.insr_year_clm_lt_amt, param.insr_psnl_brdn_amt, param.insr_sale_year, param.insr_sale_rt, param.insr_relief,
          param.insr_pcnt_sale_rt, param.insr_base_amt, param.insr_amt, param.insr_tot_amt, param.insr_tot_paid_amt, param.insr_tot_unpaid_amt,
          param.cbr_cnt, JSON.stringify(param.cbr_data), JSON.stringify(param.trx_data), param.spct_join_yn, JSON.stringify(param.spct_data), param.active_yn, 
          param.agr10_yn, param.agr20_yn, param.agr30_yn, param.agr31_yn, param.agr32_yn, param.agr33_yn, param.agr34_yn, param.agr40_yn,
          param.agr41_yn, param.agr50_yn, param.status_cd, param.rmk, param.change_rmk, param.change_dt, param.updated_id, param.updated_ip, param.renewal_cd,param.org_insr_year_clm_lt_amt, param.insurance_uuid 
        ]
        querys.push(LAWAdminMapper.UPDATE_RENEWAL_LAW_INSURANCE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.insurance_uuid
        ]
        querys.push(LAWAdminMapper.DELETE_RENEWAL_LAW_INSURANCE)
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


  getApplyLAWInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.business_cd,
      params.proc_cd,
      params.proc_cd,
      params.user_nm
    ];
    const [rowsInsrInfo] = await db.query(LAWAdminMapper.SELECT_APPLY_LAW_INSURANCE_LIST, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  setApplyLAWInsurance: async function (req) {
    const params = req.body.params
    logger.info(params)
    const queryParams = [
      params.proc_dt,
      params.proc_content,
      params.proc_cd,
      params.apply_no,
    ];
    
    const [rows] = await db.query(LAWAdminMapper.UPDATE_APPLY_LAW_INSURANCE, queryParams);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return true;
  },

  getLAW_TRX: async function (req) {
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
      params.limit,
      params.offset,
    ];
    const totalParams = [
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

    const resultData = await db.query(LAWAdminMapper.SELECT_INSURANCE_LAW_TRX_DATA_LIST, queryParams);
    const total = await db.query(LAWAdminMapper.INSURANCE_TOTAL, totalParams);
    // resultData[0].total = total[0][0].total
    let result = {
      list : resultData[0],
      total : total[0][0].total
    }
    return result;
  },

  setLAW_TRX: async function (req) {
    const params = req.body.params
    logger.info(params)
    let querys = []
    let query_params = []
    let nCnt = 0;
    for(const param of params){
      const updateQueryParams = [
        JSON.stringify(param.trx_data),
        param.insr_tot_unpaid_amt,
        param.insr_tot_paid_amt,
        param.status_cd,
        param.updated_id,
        param.updated_ip,
        param.insurance_uuid,
      ];
      querys.push(LAWAdminMapper.UPDATE_INSURANCE_LAW_TRX_DATA)
      query_params.push(updateQueryParams)
      nCnt ++
    }
    
    
    const rows_results = await db.queryListWithTransaction(querys, query_params);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    for(const rows of rows_results){
      if (rows.affectedRows < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
    }
    return nCnt;
  },

  getLAWExcel: async function (req) {
    const params = req.body.params;
    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.insr_year,
      params.status_cd,
      params.status_cd,
      params.user_nm,
    ];
    const [rows] = await db.query(LAWAdminMapper.INSURANCE_LAW_EXCEL_LIST, queryParams);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return rows;
  },

};
