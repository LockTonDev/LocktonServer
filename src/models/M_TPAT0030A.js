const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');

/**
 * 회계사_보험계약
 *
 * TABLE : TPAT0030A
 *
 */

module.exports = {
  select: async function (req) {
    const user_uuid = req.decoded.uuid;
    logger.debug(req.body.params);

    const query0030A = `SELECT 
                      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno, corp_ceo_nm,
                      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd, 
                      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                      insr_take_amt, insr_take_sec, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, 
                      insr_program_yn, insr_program, insr_service, insr_sale_year, insr_income_filename,
                      insr_sale_rt, insr_pcnt_sale_rt,insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, insr_tot_paid_amt, 
                      insr_tot_unpaid_amt, cbr_cnt, cbr_data, spct_join_yn, spct_data, active_yn, agr10_yn,
                      agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
                      agr50_yn, status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip
                      , FN_GET_CODENM('COM030', status_cd) AS status_nm
                      , FN_GET_CODENM('ADV001', corp_region_cd) AS corp_region_nm
                    FROM TPAT0030A
                    WHERE  insurance_uuid = ?
                    order by insurance_uuid`;


    const query0031A = `SELECT 
          insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
          user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
          corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd, 
          insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt, insr_program_yn, insr_program, insr_service,
          insr_take_amt, insr_take_sec, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, insr_sale_year,
          insr_sale_rt, insr_pcnt_sale_rt,insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, insr_tot_paid_amt, 
          insr_tot_unpaid_amt, cbr_cnt, cbr_data, spct_join_yn, spct_data, active_yn, agr10_yn,
          agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
          agr50_yn, status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip
          , FN_GET_CODENM('COM030', status_cd) AS status_nm
          , FN_GET_CODENM('ADV001', corp_region_cd) AS corp_region_nm
        FROM TPAT0031A
        WHERE  insurance_uuid = ?
        order by insurance_uuid`;

    let query;
    let params;
    if (req.body.params.renewal == 'Y') {
      query = query0031A;
    } else {
      query = query0030A;
    }
    params = [req.body.params.insurance_uuid];
    
    const [rows] = await db.query(query, params);

    if (rows.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rows, []);
  },

  selectList: async function (req) {
    const user_uuid = req.decoded.uuid;

    const queryListIND = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm, user_cd 
                  , insr_year, insr_st_dt, insr_cncls_dt
                  , insr_tot_amt, status_cd, cbr_cnt, cbr_data
                  , FN_GET_CODENM('COM030', status_cd) AS status_nm
                    FROM TPAT0030A
                   WHERE (user_nm = ? and user_birth = ? and user_regno = ?)
                   OR (JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_nm'), JSON_ARRAY(?))
                   AND JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_brdt'), JSON_ARRAY(?))
                   AND JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_regno'), JSON_ARRAY(?)))
                   order by created_at desc`;

    const queryListJNT = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm, user_cd 
                   , insr_year, insr_st_dt, insr_cncls_dt
                   , insr_tot_amt, status_cd, cbr_cnt, cbr_data
                   , FN_GET_CODENM('COM030', status_cd) AS status_nm
                     FROM TPAT0030A
                    WHERE user_nm = ? and corp_cnno = ?
                    order by created_at desc`;


    const userQuery = `SELECT * from tcom0110a where user_uuid = ?`
    const [user] = await db.query(userQuery, user_uuid);  

    if (user.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }  
    let params;
    let queryList;
    if(user[0].user_cd == 'IND'){
      queryList = queryListIND;
      params = [user[0].user_nm, user[0].user_birth, user[0].user_regno, user[0].user_nm, user[0].user_birth, user[0].user_regno];
    }else {
      queryList = queryListJNT;
      params = [user[0].user_nm, user[0].corp_cnno];
    }

    const [listData] = await db.query(queryList, params);
    

    const queryNewInsr = `
      select
          CASE
            WHEN COUNT(a.insurance_uuid) >= 1 THEN 'N'
            ELSE 'Y'
          END AS data
      from
        TPAT0030A a
      where
        a.user_uuid = ?
        and a.status_cd not in ('20', '40') -- 해지, 기간종료
        and a.insr_year in (
            select
              max(C.base_year)
            from
              TCOM0030A C,
              tcom0110a D
            where
              C.user_cd = D.user_cd
              and C.business_cd = D.business_cd
              and C.use_yn = 'Y'
              and D.user_uuid = ?
            order by
              C.base_year desc,
              C.ver desc
           
        )
    `;

    const queryNewInsrParams = [user_uuid, user_uuid];
    const newInsrData = await db.query(queryNewInsr, queryNewInsrParams);

    const queryRenewalInsr = `
      select
        A.insurance_uuid as data, A.insr_year
      from
        TPAT0031A A,
        tcom0110a B
      where
        A.business_cd = B.business_cd
        and ((A.user_cd = 'IND' AND A.USER_NM = B.USER_NM and A.user_birth = B.user_birth and a.user_regno  = b.user_regno)
             or (A.user_cd = 'JNT' AND A.corp_cnno = B.corp_cnno )
             or (A.user_cd = 'JNT' AND JSON_CONTAINS(JSON_EXTRACT(a.cbr_data, '$[*].cbr_nm'), JSON_ARRAY(B.USER_NM))
             AND JSON_CONTAINS(JSON_EXTRACT(A.cbr_data, '$[*].cbr_brdt'), JSON_ARRAY(B.user_birth))
             AND JSON_CONTAINS(JSON_EXTRACT(A.cbr_data, '$[*].cbr_regno'), JSON_ARRAY(b.user_regno)))
            )
        and B.user_uuid = ?
        and a.insr_year in (
            select
              max(C.base_year)
            from
              TCOM0030A C,
              tcom0110a D
            where
              C.user_cd = D.user_cd
              and C.business_cd = D.business_cd
              and C.use_yn = 'Y'
              and D.user_uuid = ?
            order by
              C.base_year desc,
              C.ver desc
           
        ) limit 1;
    `;

    const queryRenewalInsrParams = [user_uuid, user_uuid];
    const renewalInsrData = await db.query(queryRenewalInsr, queryRenewalInsrParams);

    //return Object.setPrototypeOf(listData, [])
    const result = {
      list: Object.setPrototypeOf(listData, []),
      newInsrYN: Object.setPrototypeOf(newInsrData[0], Object),
      renewalInsrUUID: Object.setPrototypeOf(renewalInsrData[0], Object)
    };

    return result;
  },

  selectStatus: async function (req) {
    const user_uuid = req.decoded.uuid;

    const queryIND = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm 
                  , insr_year, insr_st_dt, insr_cncls_dt
                  , insr_tot_amt, status_cd
                    FROM TPAT0030A
                   WHERE user_nm = ? and user_birth = ? and user_regno = ? 
                   order by created_at desc
                   LIMIT 1`;
    
    const queryJNT = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm 
                   , insr_year, insr_st_dt, insr_cncls_dt
                   , insr_tot_amt, status_cd
                     FROM TPAT0030A
                    WHERE user_nm = ? and corp_cnno = ? 
                    order by created_at desc
                    LIMIT 1`;
    const userQuery = `SELECT * from tcom0110a where user_uuid = ?`
    const [user] = await db.query(userQuery, user_uuid);  
    if (user.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }  
    //user_nm = ? and user_birth = ? and user_regno = ?

    let params;
    let query;

    if(user[0].user_cd == 'IND'){
      query = queryIND
      params = [user[0].user_nm, user[0].user_birth, user[0].user_regno];
    }else {
      query = queryJNT
      params = [user[0].user_nm, user[0].corp_cnno];
    }

    const [rows] = await db.query(query, params);

    if (rows.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(rows, []);
  },

  
  selectHistory: async function (req) {
    //const params = { user_uuid: req.decoded.uuid, insurance_uuid: req.body.params.insurance_uuid };
    const params = req.body.params
    const queryParams = [
      params.insurance_uuid
    ];  
    const queryInsrInfo = `
      SELECT A.insurance_uuid
            ,A.user_uuid
            ,A.business_cd
            ,A.user_cd
            ,A.user_id
            ,A.user_nm
            ,A.user_birth
            ,A.user_regno
            ,A.corp_type
            ,A.corp_nm
            ,A.corp_ceo_nm
            ,A.corp_bnno
            ,A.corp_cnno
            ,A.corp_telno
            ,A.corp_faxno
            ,A.corp_cust_nm
            ,A.corp_cust_hpno
            ,A.corp_cust_email
            ,A.corp_post
            ,A.corp_addr
            ,A.corp_addr_dtl
            ,A.corp_region_cd
            ,A.insr_year
            ,A.insr_reg_dt
            ,A.insr_st_dt
            ,A.insr_cncls_dt
            ,A.insr_retr_yn
            ,A.insr_retr_dt
            ,A.insr_take_amt
            ,A.insr_take_sec
            ,A.insr_clm_lt_amt
            ,A.insr_year_clm_lt_amt
            ,A.insr_psnl_brdn_amt
            ,A.insr_program_yn
            ,A.insr_program
            ,A.insr_service
            ,A.insr_income_filename
            ,A.insr_sale_year
            ,A.insr_sale_rt
            ,A.insr_pcnt_sale_rt
            ,A.insr_base_amt
            ,A.insr_amt
            ,A.insr_tot_amt
            ,A.insr_tot_paid_amt
            ,A.insr_tot_unpaid_amt
            ,A.spct_join_yn
            ,A.spct_data
            ,A.cbr_data
            ,A.cbr_cnt
            ,A.trx_data
            ,A.active_yn
            ,A.agr10_yn
            ,A.agr20_yn
            ,A.agr30_yn
            ,A.agr31_yn
            ,A.agr32_yn
            ,A.agr33_yn
            ,A.agr34_yn
            ,A.agr40_yn
            ,A.agr41_yn
            ,A.agr50_yn
            ,A.status_cd
            ,A.rmk
            ,A.change_rmk
            ,A.change_dt
            ,FN_GET_CODENM('COM030', A.status_cd) AS status_nm
            ,FN_GET_CODENM('ADV001', A.corp_region_cd) AS corp_region_nm
            ,FN_GET_SPLIT(A.corp_telno, '-', 1) as corp_telno1
            ,FN_GET_SPLIT(A.corp_telno, '-', 2) as corp_telno2
            ,FN_GET_SPLIT(A.corp_telno, '-', 3) as corp_telno3
            ,FN_GET_SPLIT(A.corp_faxno, '-', 1) as corp_faxno1
            ,FN_GET_SPLIT(A.corp_faxno, '-', 2) as corp_faxno2
            ,FN_GET_SPLIT(A.corp_faxno, '-', 3) as corp_faxno3
            ,B.insr_st_dt as base_insr_st_dt
            ,B.insr_cncls_dt as base_insr_cncls_dt
            ,B.insurance_no
      FROM   TPAT0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE A.insurance_uuid = ?
           -- AND A.user_uuid = 
            AND A.status_cd not in ('40') -- 이력제외
      ORDER  BY A.insurance_uuid DESC
      LIMIT  1 `;
      const [rowsInsrInfo] = await db.query(queryInsrInfo, queryParams);
      
      if (rowsInsrInfo.length < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
  
      return Object.setPrototypeOf(rowsInsrInfo, []);
  },

  /**
   *
   *
   *
   * @param {*} req
   * @returns
   */
  selectRenewalInfo: async function (req) {
    const params = req.body.params;

    const queryParams = [
      params.user_nm,
      params.user_birth,
      params.user_regno,
    ];

    const queryInd = `
        select
          user_cd,
          user_nm,
          user_birth,
          user_regno,
          null as corp_bnno,
          insr_retr_dt,
          insr_take_amt,
          insr_take_sec,
          insr_clm_lt_amt,
          insr_psnl_brdn_amt,
          IFNULL(NULLIF(insr_sale_rt, ''), 0) as insr_sale_rt
        from
          TPAT0031A
        where
          user_cd = 'IND'
          and user_nm = ?
          and user_birth = ?
          and user_regno = ?
    `;
    const queryJNT = `
        select
          t.user_cd,
          t.corp_bnno,
          j.cbr_nm as user_nm,
          j.cbr_brdt as user_birth,
          j.cbr_regno as user_regno,
          j.insr_retr_dt as insr_retr_dt,
          t.insr_take_amt,
          t.insr_take_sec,
          t.insr_clm_lt_amt,
          t.insr_psnl_brdn_amt,
          IFNULL(NULLIF(j.insr_sale_rt, ''), 0) as insr_sale_rt
        from
          TPAT0031A t,
          json_table(t.cbr_data,
          '$[*]' columns (
            cbr_nm VARCHAR(50) path '$.cbr_nm',
          cbr_brdt VARCHAR(8) path '$.cbr_brdt',
          cbr_type VARCHAR(20) path '$.cbr_type',
          cbr_regno VARCHAR(50) path '$.cbr_regno',
          insr_retr_dt VARCHAR(10) path '$.insr_retr_dt',
          insr_sale_rt decimal(3,0) path '$.insr_sale_rt'
        )) j
        where
          t.business_cd = 'PAT'
          and t.user_cd = 'JNT'
          and j.cbr_nm = ?
          and j.cbr_brdt = ?
          and j.cbr_regno = ?
    `;

    const [rowsInd] = await db.query(queryInd, queryParams);
    const [rowsCor] = await db.query(queryJNT, queryParams);
    const result = [...rowsInd, ...rowsCor];

    if (result.length == 0) {
       throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(result, []);
  },

  getSaleRtNDupInfo: async function (req) {
    const params = req.body.params;
    const queryParamsDataInd = [
      params.business_cd,
      params.user_nm,
      params.user_birth,
      params.user_regno,
      params.insr_year,
    ];
    const queryDataInd = `
        select
          user_cd,
          user_nm,
          user_birth,
          user_regno,
          null as corp_bnno,
          insr_retr_dt,
          insr_take_amt,
          insr_take_sec,
          insr_clm_lt_amt,
          insr_psnl_brdn_amt,
          IFNULL(NULLIF(insr_sale_year, ''), 0) as insr_sale_year,
          IFNULL(NULLIF(insr_sale_rt, ''), 0) as insr_sale_rt
        from
          TPAT0031A
        where business_cd = ?
          and user_cd = 'IND'
          and user_nm = ?
          and user_birth = ?
          and user_regno = ?
          and insr_year = ?
    `
    const queryParamsDataJNT = [
      params.insr_year,
      params.user_nm,
      params.user_birth,
      params.user_regno,
    ];

    const queryDataJNT = `
    SELECT
      t.user_cd,
      j.cbr_nm AS user_nm,
      j.cbr_brdt AS user_birth,
      j.cbr_regno AS user_regno,
      j.insr_retr_dt AS insr_retr_dt,
      COALESCE(j.insr_sale_year, 0) AS insr_sale_year,
      COALESCE(j.insr_sale_rt, 0) AS insr_sale_rt
    FROM
      TPAT0031A t
      CROSS JOIN JSON_TABLE(
        t.cbr_data,
        '$[*]' COLUMNS (
          cbr_nm VARCHAR(50) PATH '$.cbr_nm',
          cbr_brdt VARCHAR(8) PATH '$.cbr_brdt',
          cbr_type VARCHAR(20) PATH '$.cbr_type',
          cbr_regno VARCHAR(50) PATH '$.cbr_regno',
          insr_retr_dt VARCHAR(10) PATH '$.insr_retr_dt',
          insr_sale_rt DECIMAL(3, 0) PATH '$.insr_sale_rt',
          insr_sale_year INT PATH '$.insr_sale_year'
        )
      ) j
    WHERE t.insr_year = ?
      AND j.cbr_nm = ?
      AND j.cbr_brdt = ?
      AND j.cbr_regno = ?;
    `
    const queryParamsDataDup = [
      params.business_cd,
      params.user_nm,
      params.user_birth,
      params.user_regno,
      params.insr_year,
      params.business_cd,
      params.user_nm,
      params.user_birth,
      params.user_regno,
      params.insr_year,
    ];
    const queryDataDup = `
        SELECT COUNT(*) AS cnt
        FROM (
            SELECT 1
            FROM TPAT0030A
            WHERE business_cd = ?
              AND user_cd = 'IND'
              AND user_nm = ?
              AND user_birth = ?
              AND user_regno = ?
              AND insr_year = ?
              AND status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
            UNION ALL
            SELECT 1
            FROM TPAT0030A t,
            json_table(t.cbr_data,
            '$[*]' columns (
              cbr_nm VARCHAR(50) path '$.cbr_nm',
              cbr_brdt VARCHAR(8) path '$.cbr_brdt',
              cbr_regno VARCHAR(50) path '$.cbr_regno',
              status_cd VARCHAR(3) path '$.status_cd'
            )) j
            WHERE t.business_cd = ?
              AND t.user_cd = 'JNT'
              AND j.cbr_nm = ?
              AND j.cbr_brdt = ?
              AND j.cbr_regno = ?
              AND j.status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
              AND t.insr_year = ?
        ) AS cnt
      `

      const queryParamsDataMbr = [
        params.business_cd,
        params.user_nm,
        params.user_regno
      ];
      const queryDataMbr = `
      SELECT count(*) AS cnt
            FROM   tcom0111a
            WHERE  business_cd = ?
                  AND nm = ?
                  AND reg_no = ?
      `
      let [resultData] = await db.query(queryDataInd, queryParamsDataInd);
      if(resultData.length == 0 ){
        [resultData] = await db.query(queryDataJNT, queryParamsDataJNT)
      }
      const [resultDataDup] = await db.query(queryDataDup, queryParamsDataDup);
      const [resultDataMbr] = await db.query(queryDataMbr, queryParamsDataMbr);
      if (resultDataDup.length == 0 || resultDataMbr.length == 0) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
     }

     const result = {renewal:[...resultData], dup_cnt: resultDataDup[0].cnt, mbr_cnt: resultDataMbr[0].cnt}

     console.log(result)

    return Object.setPrototypeOf(
      result,
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
      const params = [
        business_cd,
        rowData.cbr_nm,
        rowData.cbr_brdt,
        rowData.cbr_regno,
        insr_year,
        business_cd,
        rowData.cbr_nm,
        rowData.cbr_brdt,
        rowData.cbr_regno,
        insr_year
      ]

      query = `SELECT COUNT(*) AS cnt
      FROM (
          SELECT 1
          FROM TPAT0030A
          WHERE business_cd = ?
            AND user_cd = 'IND'
            AND user_nm = ?
            AND user_birth = ?
            AND user_regno = ?
            AND insr_year = ?
            AND status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
          UNION ALL
          SELECT 1
          FROM TPAT0030A t,
          json_table(t.cbr_data,
          '$[*]' columns (
            cbr_nm VARCHAR(50) path '$.cbr_nm',
            cbr_brdt VARCHAR(8) path '$.cbr_brdt',
            cbr_regno VARCHAR(50) path '$.cbr_regno',
            status_cd VARCHAR(3) path '$.status_cd'
          )) j
          WHERE t.business_cd = ?
            AND t.user_cd = 'JNT'
            AND j.cbr_nm = ?
            AND j.cbr_brdt = ?
            AND j.cbr_regno = ?
            AND j.status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
            AND t.insr_year = ?
      ) AS cnt`
      logger.debug(params);
      const [rows] = await db.query(query, params);

      if (rows.length < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
      logger.debug(rows[0].cnt);
      if (rows[0].cnt > 0) {
        return true;
      }
    }
    return false;
  },

  checkFile: async function(req) {
    const params = req.body.params;

    const query = `SELECT insr_year, user_nm, insr_income_filename FROM TPAT0030A
      WHERE insurance_uuid = ?`;
    const param = [params.insurance_uuid]
    const [rows] = await db.query(query, param);

    if (rows.length < 1){
      return null
    }

    return rows[0]
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;

    const params = req.body.params;

    const query = `INSERT INTO TPAT0030A (
                      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno, corp_ceo_nm,
                      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl,corp_region_cd,
                      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                      insr_take_amt, insr_take_sec , insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, 
                      insr_program_yn, insr_program, insr_service, insr_income_filename,
                      insr_sale_year, insr_sale_rt, insr_pcnt_sale_rt, insr_base_amt, insr_amt, insr_premium_amt, insr_tot_amt, 
                      insr_tot_paid_amt, insr_tot_unpaid_amt, cbr_cnt, cbr_data,
                      trx_data, spct_join_yn, spct_data, active_yn, agr10_yn,
                      agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
                      agr50_yn, status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip
                    ) VALUES (
                      UUID_V4() , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?, ?
                      , ?, ?, ?, ?
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
      params.corp_ceo_nm,
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
      params.insr_take_amt,
      params.insr_take_sec,
      params.insr_clm_lt_amt,
      params.insr_year_clm_lt_amt,
      params.insr_psnl_brdn_amt,
      params.insr_program_yn,
      params.insr_program,
      params.insr_service,
      params.insr_income_filename,
      params.insr_sale_year,
      params.insr_sale_rt,
      params.insr_pcnt_sale_rt,
      params.insr_base_amt,
      params.insr_amt,
      params.insr_premium_amt,
      params.insr_tot_amt,
      params.insr_tot_paid_amt,
      params.insr_tot_unpaid_amt,
      params.cbr_cnt,
      JSON.stringify(params.cbr_data),
      JSON.stringify(params.trx_data),
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
    const queryIND = ` UPDATE TPAT0030A 
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
                      corp_region_cd = ?,
                      insr_year = ?,
                      insr_reg_dt = ?,
                      insr_st_dt = ?,
                      insr_cncls_dt = ?,
                      insr_retr_yn = ?,
                      insr_retr_dt = ?,
                      insr_take_amt = ?,
                      insr_take_sec = ?,
                      insr_clm_lt_amt = ?,
                      insr_year_clm_lt_amt = ?,
                      insr_psnl_brdn_amt = ?,
                      insr_program_yn = ?,
                      insr_program = ?,
                      insr_service = ?,
                      insr_sale_rt = ?,
                      insr_pcnt_sale_rt = ?,
                      insr_base_amt = ?,
                      insr_amt = ?,
                      insr_premium_amt = ?,
                      insr_tot_amt = ?,
                      insr_tot_paid_amt = ?,
                      insr_tot_unpaid_amt = ?,
                      cbr_cnt = ?,
                      cbr_data = ?,
                      trx_data = ?,
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
                    WHERE insurance_uuid = ? AND user_nm = ? and user_birth = ? and user_regno = ?
                  `;
    const queryJNT = ` UPDATE TPAT0030A 
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
                    insr_take_amt = ?,
                    insr_take_sec = ?,
                    insr_clm_lt_amt = ?,
                    insr_year_clm_lt_amt = ?,
                    insr_psnl_brdn_amt = ?,
                    insr_program_yn = ?,
                    insr_program = ?,
                    insr_service = ?,
                    insr_income_filename = ?,
                    insr_sale_rt = ?,
                    insr_pcnt_sale_rt = ?,
                    insr_base_amt = ?,
                    insr_amt = ?,
                    insr_premium_amt = ?,
                    insr_tot_amt = ?,
                    insr_tot_paid_amt = ?,
                    insr_tot_unpaid_amt = ?,
                    cbr_cnt = ?,
                    cbr_data = ?,
                    trx_data = ?,
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
                  WHERE insurance_uuid = ? AND user_nm = ? and corp_cnno = ?
                `;

    const userQuery = `SELECT * from tcom0110a where user_uuid = ?`
    const [user] = await db.query(userQuery, user_uuid);  
    if (user.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    } 
    let queryParams;
    let query;
    if(user[0].user_cd == 'IND'){
      query = queryIND;
      queryParams = [
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
        params.insr_take_amt,
        params.insr_take_sec,
        params.insr_clm_lt_amt,
        params.insr_year_clm_lt_amt,
        params.insr_psnl_brdn_amt,
        params.insr_program_yn,
        params.insr_program,
        params.insr_service,
        params.insr_sale_rt,
        params.insr_pcnt_sale_rt,
        params.insr_base_amt,
        params.insr_amt,
        params.insr_premium_amt,
        params.insr_tot_amt,
        params.insr_tot_paid_amt,
        params.insr_tot_unpaid_amt,
        params.cbr_cnt,
        JSON.stringify(params.cbr_data),
        JSON.stringify(params.trx_data),
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
        user[0].user_nm, 
        user[0].user_birth, 
        user[0].user_regno
      ];
    }else {
      query = queryJNT;
      queryParams = [
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
        params.insr_take_amt,
        params.insr_take_sec,
        params.insr_clm_lt_amt,
        params.insr_year_clm_lt_amt,
        params.insr_psnl_brdn_amt,
        params.insr_program_yn,
        params.insr_program,
        params.insr_service,
        params.insr_income_filename,
        params.insr_sale_rt,
        params.insr_pcnt_sale_rt,
        params.insr_base_amt,
        params.insr_amt,
        params.insr_premium_amt,
        params.insr_tot_amt,
        params.insr_tot_paid_amt,
        params.insr_tot_unpaid_amt,
        params.cbr_cnt,
        JSON.stringify(params.cbr_data),
        JSON.stringify(params.trx_data),
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
        user[0].user_nm, 
        user[0].corp_cnno
      ];
    }
    logger.debug(queryParams);
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return true;
  },
  delete: async function (req) {
    const user_uuid = req.decoded.uuid;
    const queryIND = 'DELETE FROM TPAT0030A WHERE insurance_uuid = ? AND user_nm = ? and user_birth = ? and user_regno = ?';
    const queryJNT = 'DELETE FROM TPAT0030A WHERE insurance_uuid = ? AND user_nm = ? and corp_cnno = ?';
    const userQuery = `SELECT * from tcom0110a where user_uuid = ?`
    const [user] = await db.query(userQuery, user_uuid);  
    if (user.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    } 
    let queryParams;
    let query;
    if(user[0].user_cd == 'IND'){
      queryParams = [params.insurance_uuid, user[0].user_nm, user[0].user_birth, user[0].user_regno];
      query = queryIND;
    }else {
      queryParams = [params.insurance_uuid, user[0].user_nm, user[0].copr_cnno];
      query = queryJNT;
    }

    //user_nm = ? and user_birth = ? and user_regno = ?
    
    const [rows] = await db.queryWithTransaction(query, queryParams);
    

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.DELETE_FAILED);
    }
    return true;
  },

  updateUserInfo: async function (params) {
    const query = ` UPDATE TPAT0030A 
                    SET 
                      user_id = ?,
                      user_uuid = ?,
                      updated_at = now(),
                      updated_id = ?,
                      updated_ip = ?
                    WHERE user_nm = ? and user_birth = ? and user_regno = ? 
                    -- and user_uuid = ''
                  `;

    const queryParams = [
      params.user_id,
      params.user_uuid,
      params.updated_id,
      params.updated_ip,
      params.user_nm,
      params.user_birth,
      params.user_regno
    ];
    logger.debug(queryParams);
    logger.debug(query);
    const [rows] = await db.queryWithTransaction(query, queryParams);
    logger.debug(rows);
    // if (rows.affectedRows < 1) {
    //   throw new NotFound(StatusMessage.UPDATE_FAILED);
    // }

    return true;
  }
};
