const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const knexDB = require('../config/knexDB');
const AdminMapper = require('../mapper/AdminMapper');
const AdminMasterMapper = require('../mapper/AdminMasterMapper');
const AdminUserMapper = require('../mapper/AdminUserMapper');
const AdminBoardMapper = require('../mapper/AdminBoardMapper');

module.exports = {
  /**
   *
   * @param {*} req
   * @returns
   */
  getApplyInsurance: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.SELECT_APPLY_INSURANCE_LIST, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setApplyInsurance: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.UPDATE_APPLY_INSURANCE, params);
    return true;
  },
  getRenewalInsurance: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMasterMapper.INSURANCE_RENEWAL_LIST, params);
    return resultData[0];
  },
  setUsersTemp: async function (paramsList) {
    // logger.debug('DB실행전 ' + paramsList.length);
    let results = await db.fetch('AdminMapper.insert_TAX_COR_TCOM0110A_TEMP', paramsList);

    // for (const params of paramsList) {
    //   let result = await db.fetch('AdminMapper.insert_TAX_COR_TCOM0110A_TEMP', params);

    //   if (result.affectedRows < 1) {
    //     throw new NotFound(StatusMessage.INSERT_FAILED);
    //   }
    // }
    return results;
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  getUserRegNo: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminUserMapper.SELECT_USER_REG_NO_LIST, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setUserRegNo: async function (req) {
    const { params } = req.body;
    let resultData;

    if (params.mode === 'C') {
      resultData = await knexDB.raw(AdminUserMapper.INSERT_USER_REG_NO, params);
    } else if (params.mode === 'D') {
      resultData = await knexDB.raw(AdminUserMapper.DELETE_USER_REG_NO, params);
    } else {
      return false;
    }
    return true;
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  getBoardInfo: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.SELECT_BOARD_INFO, params);
    return resultData[0];
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  getBoardList: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.SELECT_BOARD_LIST, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setInsertBoard: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.INSERT_BOARD, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setUpdateBoard: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.UPDATE_BOARD, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setDeleteBoard: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.DELETE_BOARD, params);
    return resultData[0];
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  getUserInfo: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminUserMapper.SELECT_USER_INFO, params);
    return resultData[0];
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  getUserList: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminUserMapper.SELECT_USER_LIST, params);
    return resultData[0];
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  setUserLoginBlockReset: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminUserMapper.UPDATE_USER_LOGIN_BLOCK_RESET, params);
    logger.error(resultData);
    return true;
  },

  /**
   *
   * @param {*} req
   * @returns
   */
  setUserInfo: async function (req) {
    const { params } = req.body;
    let resultData;

    // logger.debug(params);
    // logger.debug(params.type);

    if (params.mode === 'C') {
      resultData = await knexDB.raw(AdminUserMapper.INSERT_USER, params);
    } else if (params.mode === 'U') {
      resultData = await knexDB.raw(AdminUserMapper.UPDATE_USER, params);
    } else if (params.mode === 'D') {
      resultData = await knexDB.raw(AdminUserMapper.DELETE_USER, params);
    } else {
      return false;
    }
    return true;
    // return resultData[0];
  },

  setUser: async function (params) {
    let transaction;
    try {
      transaction = await knexDB.transaction();
      for (const param of params) {
        if (param.mode === 'C') await transaction.raw(AdminUserMapper.INSERT_USER, param);
        else if (param.mode === 'U') await transaction.raw(AdminMapper.UPDATE_USER, param);
        else if (param.mode === 'D') await transaction.raw(AdminMapper.DELETE_USER, param);
      }

      await transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },

  setUser: async function (params) {
    let transaction;
    try {
      transaction = await knexDB.transaction();
      for (const param of params) {
        if (param.mode === 'C') await transaction.raw(AdminUserMapper.INSERT_USER, param);
        else if (param.mode === 'U') await transaction.raw(AdminMapper.UPDATE_USER, param);
        else if (param.mode === 'D') await transaction.raw(AdminMapper.DELETE_USER, param);
      }

      await transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },
  /**
   *
   * @param {*} req
   * @returns
   */
    setUserPassword: async function (params) {
      //const { params } = req.body;
      const resultData = await knexDB.raw(AdminUserMapper.UPDATE_USER_PASSWORD, params);
      logger.error(resultData);
      return true;
    },
  /**
   *
   * @param {*} req
   * @returns
   */
  setInsertUser: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.INSERT_USER, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setUpdateUser: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.UPDATE_USER, params);
    return resultData[0];
  },
  /**
   *
   * @param {*} req
   * @returns
   */
  setDeleteUser: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminBoardMapper.DELETE_USER, params);
    return resultData[0];
  },

  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  getTAXRate: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.INSURANCE_RATE_TOP, params);
    return resultData[0];
  },

  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  getTAX: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.INSURANCE_INFO, params);
    logger.info(resultData[0])
    return resultData[0];
  },

  getTAXS: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    return resultData[0];
  },
  
  getTAXExcel: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.INSURANCE_EXCEL_LIST, params);
    return resultData[0];
  },

  getTAXRenewalExcel: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.INSURANCE_RENEWAL_EXCEL_LIST, params);
    return resultData[0];
  },
  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  getTAX_TRX: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.SELECT_INSURANCE_TRX_DATA_LIST, params);
    return resultData[0];
  },

  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  setTAX_TRX: async function (req) {
    const { params } = req.body;
    logger.error(params);
    let nCnt = 0;
    let transaction;
    try {
      transaction = await knexDB.transaction();

      for (const param of params) {
        //총입금액이 '' 일경우 오류, null로 변경 2024-07-04
        if(param.insr_tot_paid_amt == '') param.insr_tot_paid_amt = null
        param.trx_data = JSON.stringify(param.trx_data);
        await transaction.raw(AdminMapper.UPDATE_INSURANCE_TRX_DATA, param);
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

  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  getRenewal: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.RENEWAL_INSURANCE_INFO, params);
    return resultData[0];
  },

  getRenewals: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminMapper.RENEWAL_INSURANCE_LIST, params);
    return resultData[0];
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;

    const params = req.body.params;

    const query = `INSERT INTO TTAX0030A (
      insurance_uuid, insurance_seq, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd,
      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
      insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt,
      insr_sale_year, insr_sale_rt, insr_pcnt_sale_rt, insr_base_amt, insr_amt, insr_tot_amt, insr_tot_paid_amt, insr_tot_unpaid_amt,
      active_yn,
      agr10_yn, agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn, agr50_yn,
      status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip,
      cons_join_yn, cons_data, spct_join_yn, spct_data, cbr_cnt, cbr_data, trx_data
    ) VALUES (
      UUID_V4(), 1, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`;

    const queryParams = [
      user_uuid,
      params.insurance_no,
      params.business_cd,
      params.user_cd,
      params.user_id,
      params.user_nm,
      params.user_birth,
      params.user_regno,
      params.corp_type,
      params.corp_nm,
      params.corp_bnno,
      params.corp_cnno,
      params.corp_telno,
      params.corp_faxno,
      params.corp_cust_nm,
      params.corp_cust_hpno,
      params.corp_cust_email,
      params.corp_post,
      params.corp_addr,
      params.corp_addr_dtl,
      params.corp_region_cd,
      params.insr_year,
      params.insr_reg_dt,
      params.insr_st_dt,
      params.insr_cncls_dt,
      params.insr_retr_yn,
      params.insr_retr_dt,
      params.insr_pblc_brdn_rt,
      params.insr_clm_lt_amt,
      params.insr_year_clm_lt_amt,
      params.insr_psnl_brdn_amt,
      params.insr_sale_year,
      params.insr_sale_rt,
      params.insr_pcnt_sale_rt,
      params.insr_base_amt,
      params.insr_amt,
      params.insr_tot_amt,
      params.insr_tot_paid_amt,
      params.insr_tot_unpaid_amt,
      params.active_yn,
      params.agr10_yn,
      params.agr20_yn,
      params.agr30_yn,
      params.agr31_yn,
      params.agr32_yn,
      params.agr33_yn,
      params.agr34_yn,
      params.agr40_yn,
      params.agr41_yn,
      params.agr50_yn,
      params.status_cd,
      params.rmk,
      params.change_rmk,
      params.change_dt,
      params.created_id,
      params.created_ip,
      params.updated_id,
      params.updated_ip,
      params.cons_join_yn,
      JSON.stringify(params.cons_data),
      params.spct_join_yn,
      JSON.stringify(params.spct_data),
      params.cbr_cnt,
      JSON.stringify(params.cbr_data),
      JSON.stringify(params.trx_data)
    ];

    // logger.debug(queryParams);
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },

  setTAX: async function (req) {
    const { params } = req.body;
    logger.debug(params);

    let transaction;
    try {
      transaction = await knexDB.transaction();
      let index = 0;
      for (const param of params) {
        //회원정보 없을시 맵핑
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
            
            if(resultData.length>0){
              param.user_uuid = resultData[0].user_uuid
              param.user_id = resultData[0].user_id
            }
          }else{
            const sqlCORSelect = `SELECT user_uuid, user_id
                                    FROM TCOM0110A 
                                  WHERE user_nm = ? 
                                    and corp_cnno = ?
                                    and business_cd = ?
                                    and user_cd = ?
                                    and status_cd not in ('90')`;
            const select_params = [param.user_nm ,param.corp_cnno,param.business_cd,param.user_cd]
            const [resultData] =   await knexDB.raw(sqlCORSelect, select_params);
            if(resultData.length>0){
              param.user_uuid = resultData[0].user_uuid
              param.user_id = resultData[0].user_id
            }
          }
        }

        param.cbr_data = JSON.stringify(param.cbr_data);
        param.trx_data = JSON.stringify(param.trx_data);
        param.cons_data = JSON.stringify(param.cons_data);
        param.spct_data = JSON.stringify(param.spct_data);

        if (param.mode === 'C') await transaction.raw(AdminMapper.INSERT_INSURANCE, param);
        else if (param.mode === 'U') await transaction.raw(AdminMapper.UPDATE_INSURANCE, param);
        else if (param.mode === 'D') await transaction.raw(AdminMapper.DELETE_INSURANCE, param);
      }

      await transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },

  setTAXRenewal: async function (req) {
    const { params } = req.body;

    let transaction;
    try {
      transaction = await knexDB.transaction();
      let index = 0;
      for (const param of params) {
        param.cbr_data = JSON.stringify(param.cbr_data);
        param.trx_data = JSON.stringify(param.trx_data);
        param.cons_data = JSON.stringify(param.cons_data);
        param.spct_data = JSON.stringify(param.spct_data);
       
        if (param.mode === 'C') await transaction.raw(AdminMapper.INSERT_RENEWAL_INSURANCE, param);
        else if (param.mode === 'U') await transaction.raw(AdminMapper.UPDATE_RENEWAL_INSURANCE, param);
        else if (param.mode === 'D') await transaction.raw(AdminMapper.DELETE_RENEWAL_INSURANCE, param);
      }

      await transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },

  insertACC: async function (paramsList) {
    let tableNm = 'TACC0030A';

    if (paramsList.renewal == 'Y') tableNm = 'TACC0031A';
    // logger.debug(tableNm);

    const query =
      `INSERT INTO ` +
      tableNm +
      `
    (
      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl,corp_region_cd,
      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
      insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, 
      insr_sale_rt, insr_pcnt_sale_rt, insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, cbr_cnt,
      cbr_data, cons_join_yn, cons_data, spct_join_yn, spct_data, active_yn, agr10_yn,
      agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
      agr50_yn, trans_cd, payment_dt, payment_amt, leftover_amt, complete_dt, status_cd,
      rmk, created_id, created_ip, updated_id, updated_ip
    ) VALUES (
      UUID_V4() , ?, ?, ?, ?, ?
      , ?, ?, ?, ?, ?
      , ?, ?, ?, ?, ?
      , ?, ?
      , ?, ?, ?, ?, ?
      , ?, ?, ?, ?, ?
      , ?, ?, ?, ?, ?
      , ?, ?, ?, ?
      , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
    )`;

    for (const params of paramsList) {
      const queryParams = [
        '',
        params.insurance_no,
        params.business_cd,
        params.user_cd,
        params.user_id,
        params.user_nm,
        params.user_birth,
        params.user_regno,
        params.corp_type,
        params.corp_nm,
        params.corp_bnno,
        params.corp_cnno,
        params.corp_telno,
        params.corp_faxno,
        params.corp_cust_nm,
        params.corp_cust_hpno,
        params.corp_cust_email,
        params.corp_post,
        params.corp_addr,
        params.corp_addr_dtl,
        params.corp_region_cd,
        params.insr_year,
        params.insr_reg_dt,
        params.insr_st_dt,
        params.insr_cncls_dt,
        params.insr_retr_yn,
        params.insr_retr_dt,
        params.insr_pblc_brdn_rt,
        params.insr_clm_lt_amt,
        params.insr_year_clm_lt_amt,
        params.insr_psnl_brdn_amt,
        params.insr_sale_rt,
        params.insr_pcnt_sale_rt,
        params.insr_base_amt,
        params.insr_amt,
        params.insr_premium_amt,
        params.insr_tot_amt,
        params.cbr_cnt,
        JSON.stringify(params.cbr_data),
        params.cons_join_yn,
        JSON.stringify(params.cons_data),
        params.spct_join_yn,
        JSON.stringify(params.spct_data),
        params.active_yn,
        params.agr10_yn,
        params.agr20_yn,
        params.agr30_yn,
        params.agr31_yn,
        params.agr32_yn,
        params.agr33_yn,
        params.agr34_yn,
        params.agr40_yn,
        params.agr41_yn,
        params.agr50_yn,
        params.trans_cd,
        params.payment_dt,
        params.payment_amt,
        params.leftover_amt,
        params.complete_dt,
        params.status_cd,
        params.rmk,
        params.created_id,
        params.created_ip,
        params.updated_id,
        params.updated_ip
      ];
      const [rows] = await db.queryWithTransaction(query, queryParams);

      if (rows.affectedRows < 1) {
        throw new NotFound(StatusMessage.INSERT_FAILED);
      }
    }
    return true;
  },

  setACC: async function (req) {
    return this.insertACC(req.body.params);
  },
  setACCS: async function (req) {
    return this.insertACC(req.body.params);
  },

  setACCSRenewal: async function (req) {
    req.body.params.renewal = 'Y';
    return this.insertACC(req.body.params);
  } , 
  /**
  *
  * @param {*} req
  * @returns
  */
  getStockStartDtInfo: async function (req) {
   const { params } = req.body;
   const resultData = await knexDB.raw(AdminMapper.SELECT_STOCK_START_DT_LIST, params);
   return resultData[0];
 },

  /**
   *
   * @param {*} req
   * @returns
   */
  getUserExcel: async function (req) {
    const { params } = req.body;
    const resultData = await knexDB.raw(AdminUserMapper.SELECT_USER_LIST, params);
    return resultData[0];
  },
  // 임시 함수
  setUserEncrypt: async function (params) {
    let transaction;
    try {
      transaction = await knexDB.transaction();
      for (const param of params) {
        console.log(param)
        await transaction.raw(AdminUserMapper.UPDATE_USER_ENCRYPT, param);

      }

      await transaction.commit();
    } catch (error) {
      console.log(error)
      if (transaction) {
        await transaction.rollback();
      }
      logger.error(error);
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },
};
