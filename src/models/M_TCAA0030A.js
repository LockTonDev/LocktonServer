const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');

/**
 * 관세사_보험계약
 *
 * TABLE : TCAA0030A
 *
 */

module.exports = {
  select: async function (req) {
    const user_uuid = req.decoded.uuid;

    const query = `SELECT 
                    insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                    user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
                    corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl,
                    insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                    insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt,
                    insr_sale_rt, insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, cbr_cnt,
                    cbr_data, cons_join_yn, cons_data, spct_join_yn, spct_data, active_yn, agr10_yn,
                    agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
                    agr50_yn, trans_cd, payment_dt, payment_amt, leftover_amt, complete_dt, status_cd,
                    rmk, created_id, created_ip, updated_id, updated_ip
                    , FN_GET_CODENM('COM030', status_cd) AS status_nm
                    , FN_GET_CODENM('COM030', status_cd) AS status_nm


                          FROM TCAA0030A
                   WHERE  user_uuid = ? and insurance_uuid = ?
                   order by insurance_uuid`;

    const queryParams = [user_uuid, req.params.insurance_uuid];

    const [rows] = await db.query(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rows, []);
  },
  selectList: async function (req) {
    const user_uuid = req.decoded.uuid;

    const query = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm 
                  , insr_year, insr_st_dt, insr_cncls_dt
                  , insr_tot_amt, status_cd
                  , FN_GET_CODENM('COM030', status_cd) AS status_nm
                    FROM TCAA0030A
                   WHERE user_uuid = ? 
                   order by created_at desc`;

    const [rows] = await db.query(query, user_uuid);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(rows, []);
  },

  selectStatus: async function (req) {
    const user_uuid = req.decoded.uuid;

    const query = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm 
                  , insr_year, insr_st_dt, insr_cncls_dt
                  , insr_tot_amt, status_cd
                    FROM TCAA0030A
                   WHERE user_uuid = ? 
                   order by created_at desc
                   LIMIT 1`;

    const [rows] = await db.query(query, user_uuid);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(rows, []);
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;

    const params = req.body.params;

    const query = `INSERT INTO TCAA0030A (
                      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
                      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl,
                      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                      insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt,
                      insr_sale_rt, insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, cbr_cnt,
                      cbr_data, cons_join_yn, cons_data, spct_join_yn, spct_data, active_yn, agr10_yn,
                      agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
                      agr50_yn, trans_cd, payment_dt, payment_amt, leftover_amt, complete_dt, status_cd,
                      rmk, created_id, created_ip, updated_id, updated_ip
                    ) VALUES (
                      UUID_V4() , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?
                      , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
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
      params.insr_base_amt,
      params.insr_premium_amt,
      params.insr_amt,
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
    logger.debug(queryParams);
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },
  update: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    const query = ` UPDATE TCAA0030A 
                    SET 
                      insurance_no = ?,
                      business_cd = ?,
                      user_cd = ?,
                      user_id = ?,
                      user_nm = ?,
                      user_birth = ?,
                      user_regno = ?,
                      corp_type = ?,
                      corp_nm = ?,
                      corp_bnno = ?,
                      corp_cnno = ?,
                      corp_telno = ?,
                      corp_faxno = ?,
                      corp_cust_nm = ?,
                      corp_cust_hpno = ?,
                      corp_cust_email = ?,
                      corp_post = ?,
                      corp_addr = ?,
                      corp_addr_dtl = ?,
                      insr_year = ?,
                      insr_reg_dt = ?,
                      insr_st_dt = ?,
                      insr_cncls_dt = ?,
                      insr_retr_yn = ?,
                      insr_retr_dt = ?,
                      insr_pblc_brdn_rt = ?,
                      insr_clm_lt_amt = ?,
                      insr_year_clm_lt_amt = ?,
                      insr_psnl_brdn_amt = ?,
                      insr_sale_rt = ?,
                      insr_base_amt = ?,
                      insr_amt = ?,
                      insr_premium_amt = ?,
                      insr_tot_amt = ?,
                      cbr_cnt = ?,
                      cbr_data = ?,
                      cons_join_yn = ?,
                      cons_data = ?,
                      spct_join_yn = ?,
                      spct_data = ?,
                      active_yn = ?,
                      agr10_yn = ?,
                      agr20_yn = ?,
                      agr30_yn = ?,
                      agr31_yn = ?,
                      agr32_yn = ?,
                      agr33_yn = ?,
                      agr34_yn = ?,
                      agr40_yn = ?,
                      agr41_yn = ?,
                      agr50_yn = ?,
                      trans_cd = ?,
                      payment_dt = ?,
                      payment_amt = ?,
                      leftover_amt = ?,
                      complete_dt = ?,
                      status_cd = ?,
                      rmk = ?,
                      updated_at = now(),
                      updated_id = ?,
                      updated_ip = ?
                    WHERE insurance_uuid = ? AND user_uuid = ?
                  `;

    const queryParams = [
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
      params.updated_id,
      params.updated_ip,
      params.insurance_uuid,
      user_uuid
    ];
    logger.debug(queryParams);
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return true;
  },
  delete: async function (req) {
    const user_uuid = req.decoded.uuid;
    const query = 'DELETE FROM TCAA0030A WHERE insurance_uuid = ? AND user_uuid = ?';
    const queryParams = [params.insurance_uuid, user_uuid];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.DELETE_FAILED);
    }
    return true;
  }
};
