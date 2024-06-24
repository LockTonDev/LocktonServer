const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const knexDB = require('../config/knexDB');
const TTAX0030AMapper = require('../mapper/TTAX0030AMapper');

/**
 * 보험계약
 *
 * TABLE : TTAX0030A
 *
 */

module.exports = {
  select: async function (req) {
    const params = { user_uuid: req.decoded.uuid, insurance_uuid: req.body.params.insurance_uuid };
    let resultData = null;
    if (req.body.params.renewal == 'Y') {
      resultData = await knexDB.raw(TTAX0030AMapper.RENEWAL_INSURANCE_INFO, params);
    } else {
      resultData = await knexDB.raw(TTAX0030AMapper.INSURANCE_INFO, params);
    }
    return resultData[0];
  },

  selectHistory: async function (req) {
    const params = { user_uuid: req.decoded.uuid, insurance_uuid: req.body.params.insurance_uuid };
    const resultData = await knexDB.raw(TTAX0030AMapper.INSURANCE_INFO, params);

    return resultData[0];
  },

  /**
   * 1. 보험목록 조회
   * 2. 신규가입 가능여부 조회
   * 3. 갱신기간 조회
   * 4. 갱신가입 UUID 조회
   *
   * @param {*} req
   * @returns
   */
  selectList: async function (req) {
    const params = { user_uuid: req.decoded.uuid };

    const listData = await knexDB.raw(TTAX0030AMapper.INSURANCE_LIST, params);
    const newInsrData = await knexDB.raw(TTAX0030AMapper.INSURANCE_UUID_YN, params);
    const renewalInsrData = await knexDB.raw(TTAX0030AMapper.RENEWAL_INSURANCE_UUID, params);

    const result = {
      list: listData[0],
      newInsrYN: newInsrData[0][0],
      renewalInsrUUID: renewalInsrData[0][0]
    };
    return result;
  },

  selectStatus: async function (req) {
    const params = { user_uuid: req.decoded.uuid };
    const resultData = await knexDB.raw(TTAX0030AMapper.INSURANCE_STATUS, params);

    return resultData[0];
  },

  /**
   * 할인할증 및 중복가입여부를 확인한다.
   *
   * 1. 할인할증률 조회 [갱신DB]
   * 2. 중복가입여부[보험DB] 확인
   *
   *
   * @param {*} req
   * @returns
   */
  getSaleRtNDupInfo: async function (req) {
    const params = req.body.params;

    // [갱신DB] 개인_할인할증 조회
    const resultDataInd = await knexDB.raw(TTAX0030AMapper.RENEWAL_INSURANCE_IND_SALE_RT_INFO, params);

    // [갱신DB] 법인_할인할증 조회
    const resultDataCor = await knexDB.raw(TTAX0030AMapper.RENEWAL_INSURANCE_COR_SALE_RT_INFO, params);

    // [보험DB] 가입여부 조회
    const resultDataDup = await knexDB.raw(TTAX0030AMapper.INSURANCE_DUP_CNT, params);

    // [명단DB] 가입여부 조회
    const resultDataMbr = await knexDB.raw(TTAX0030AMapper.TCOM0111A_MBR_CNT, params);

    const result = [...resultDataInd[0], ...resultDataCor[0]];

    return Object.setPrototypeOf(
      { renewal: result, dup_cnt: resultDataDup[0][0].cnt, mbr_cnt: resultDataMbr[0][0].cnt },
      []
    );
  },

  chkDup: async function (req) {
    const cbr_data = req.body.params.cbr_data;
    const insr_year = req.body.params.insr_year;
    const business_cd = req.body.params.business_cd;

    // [명단DB] 가입여부 조회
    // 배열의 각 요소에 대해 가입여부 조회
    for (const rowData of cbr_data) {
      const params = {
        insr_year: insr_year,
        business_cd: business_cd,
        user_nm: rowData.cbr_nm,
        user_birth: rowData.cbr_brdt,
        user_regno: rowData.cbr_regno
      };
      logger.debug(params);
      const result = await knexDB.raw(TTAX0030AMapper.INSURANCE_DUP_CNT, params);
      logger.debug(result[0][0].cnt);
      if (result[0][0].cnt > 0) {
        return params;
      }
    }
    return null;
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;

    const params = req.body.params;

    const query = `INSERT INTO TTAX0030A (
      insurance_uuid, insurance_seq, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
      user_regno, corp_type, corp_nm, corp_ceo_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd,
      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
      insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt,
      insr_sale_year, insr_sale_rt, insr_pcnt_sale_rt, insr_base_amt, insr_amt, insr_tot_amt, insr_tot_paid_amt, insr_tot_unpaid_amt,
      active_yn,
      agr10_yn, agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn, agr50_yn,
      status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip,
      cons_join_yn, cons_data, spct_join_yn, spct_data, cbr_cnt, cbr_data, trx_data
    ) VALUES (
      UUID_V4(), 1, ?, ?, ?, ?, ?, ?, ?, ?,
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
      params.corp_ceo_nm,
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
    const query = ` UPDATE TTAX0030A 
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
                      corp_ceo_nm = ?,
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
                      corp_region_cd = ?,
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
                      insr_sale_year = ?,
                      insr_sale_rt = ?,
                      insr_pcnt_sale_rt = ?,
                      insr_base_amt = ?,
                      insr_amt = ?,
                      insr_tot_amt = ?,
                      insr_tot_paid_amt = ?,
                      insr_tot_unpaid_amt = ?,
                      cbr_cnt = ?,
                      cbr_data = ?,
                      trx_data = ?,
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
                      status_cd = ?,
                      rmk = ?,
                      change_rmk = ?,
                      change_dt = ?,
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
      params.corp_ceo_nm,
      params.corp_bnno,
      params.corp_cnno,
      params.corp_telno1 + '-' + params.corp_telno2 + '-' + params.corp_telno3,
      params.corp_faxno1 + '-' + params.corp_faxno2 + '-' + params.corp_faxno3,
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
      params.cbr_cnt,
      JSON.stringify(params.cbr_data),
      JSON.stringify(params.trx_data),
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
      params.status_cd,
      params.rmk,
      params.change_rmk,
      params.change_dt,
      params.updated_id,
      params.updated_ip,
      params.insurance_uuid,
      user_uuid
    ];
    logger.debug(queryParams);
    logger.debug(params.corp_region_cd);
    const [rows] = await db.queryWithTransaction(query, queryParams);
    logger.error(rows);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return true;
  },

  delete: async function (req) {
    const user_uuid = req.decoded.uuid;
    const query = 'DELETE FROM TTAX0030A WHERE insurance_uuid = ? AND user_uuid = ?';
    const queryParams = [params.insurance_uuid, user_uuid];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.DELETE_FAILED);
    }

    return true;
  },
  updateFromUserInfo: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    const query = `UPDATE TTAX0030A SET corp_type=?, corp_nm=?, corp_ceo_nm=?, corp_bnno=?, corp_cnno=?, corp_telno=?, corp_faxno=?
                  , corp_cust_nm=?, corp_cust_hpno=?, corp_cust_email=?, corp_post=?, corp_addr=?, corp_addr_dtl=?, corp_region_cd=?
                  , updated_at=now(), updated_ip=?
                  WHERE status_cd in ('10','80') and user_uuid = ?`;

    const queryParams = [
      params.corp_type,
      params.corp_nm,
      params.corp_ceo_nm,
      params.corp_bnno,
      params.corp_cnno,
      params.corp_telno1 + '-' + params.corp_telno2 + '-' + params.corp_telno3,
      params.corp_faxno1 + '-' + params.corp_faxno2 + '-' + params.corp_faxno3,
      params.corp_cust_nm,
      params.user_hpno,
      params.user_email,
      params.corp_post,
      params.corp_addr,
      params.corp_addr_dtl,
      params.corp_region_cd,
      params.updated_ip,
      user_uuid
    ];

    logger.debug(queryParams);
    logger.debug(query);
    const [rows] = await db.queryWithTransaction(query, queryParams);
    logger.debug(rows);
    // if (rows.affectedRows < 1) {
    //   throw new NotFound(StatusMessage.UPDATE_FAILED);
    // }

    return true;
  },

  updateUserInfo: async function (params) {
    const result = await knexDB.raw(TTAX0030AMapper.UPDATE_INSURANCE_MAPPING_WITH_LOGIN_INFO, params);

    return true;
  },

  updateRenewalState: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
   // const result = await knexDB.raw(TTAX0030AMapper.RENEWAL_STAT_UPDATE, params);

    const query = `UPDATE TTAX0031A SET renewal_cd = 'Y' WHERE USER_UUID = ? AND INSR_YEAR= ?`;
    const queryParams = [user_uuid, params.insr_year];
    
    logger.debug('updateRenewalState>>>'+queryParams);
    logger.debug(query);
    const [rows] = await db.queryWithTransaction(query, queryParams);
    logger.debug('updateRenewalState rows >>>'+rows);
    return true;
  }
};
