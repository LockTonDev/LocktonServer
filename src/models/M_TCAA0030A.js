const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const encrypt = require("../config/encrypt");

/**
 * 관세사_보험계약
 *
 * TABLE : TCAA0030A
 *
 */

module.exports = {
  select: async function (req) {
    const user_uuid = req.decoded.uuid;
    logger.debug(req.body.params);

    const queryCAA0030A = `SELECT 
                      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                      user_regno, corp_type, corp_nm, corp_ceo_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
                      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd, 
                      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                      insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, insr_sale_year,
                      insr_sale_rt, insr_pcnt_sale_rt,insr_base_amt, insr_amt, insr_tot_amt, cbr_cnt,
                      cbr_data, cons_join_yn, cons_data, spct_join_yn, spct_data, active_yn, agr10_yn,
                      agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
                      agr50_yn, status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip
                      , FN_GET_CODENM('COM030', status_cd) AS status_nm
                      , FN_GET_CODENM('ACC001', corp_region_cd) AS corp_region_nm
                    FROM TCAA0030A
                    WHERE insurance_uuid = ?
                    order by insurance_uuid`;


    const queryCAA0031A = `SELECT 
          insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
          user_regno, corp_type, corp_nm, corp_ceo_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno,
          corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd, 
          insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
          insr_pblc_brdn_rt, insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt,insr_sale_year,
          insr_sale_rt, insr_pcnt_sale_rt,insr_base_amt, insr_amt, insr_tot_amt, cbr_cnt,
          cbr_data, cons_join_yn, cons_data, spct_join_yn, spct_data, active_yn, agr10_yn,
          agr20_yn, agr30_yn, agr31_yn, agr32_yn, agr33_yn, agr34_yn, agr40_yn, agr41_yn,
          agr50_yn, status_cd, rmk, change_rmk, change_dt, created_id, created_ip, updated_id, updated_ip
          , FN_GET_CODENM('COM030', status_cd) AS status_nm
          , FN_GET_CODENM('ACC001', corp_region_cd) AS corp_region_nm
        FROM TCAA0031A
        WHERE  insurance_uuid = ?
        order by insurance_uuid`;

    let query;
    let params;
    if (req.body.params.renewal == 'Y') {
      query = queryCAA0031A;
    } else {
      query = queryCAA0030A;
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

    const queryListIND = `
          select ta.insurance_uuid, ta.user_uuid, ta.insurance_no, ta.user_nm, ta.user_cd 
              , ta.insr_year, ta.insr_st_dt, ta.insr_cncls_dt
              , ta.insr_tot_amt, ta.status_cd, ta.cbr_cnt, ta.cbr_data
              , FN_GET_CODENM('COM030', ta.status_cd) AS status_nm
              , B.use_yn, B.rn_st_dt , B.rn_en_dt
              from TCAA0030A ta
             LEFT JOIN TCOM0030A B
               ON ta.insr_year = B.base_year
              AND ta.user_cd = B.user_cd
              AND ta.business_cd = B.business_cd
            where ta.user_nm = ? and ta.user_birth = ? and ta.user_regno = ?
        union all
            SELECT t.insurance_uuid, t.user_uuid, t.insurance_no, t.user_nm, t.user_cd 
                  , t.insr_year, t.insr_st_dt, t.insr_cncls_dt
                  , t.insr_tot_amt, t.status_cd, t.cbr_cnt, t.cbr_data
                  , FN_GET_CODENM('COM030', t.status_cd) AS status_nm
                  , 'N' as use_yn, '' as rn_st_dt , '' as rn_en_dt
                    FROM TCAA0030A t,
                    json_table(t.cbr_data,
					    '$[*]' columns (
					      cbr_nm VARCHAR(50) path '$.cbr_nm',
					      cbr_brdt VARCHAR(8) path '$.cbr_brdt',
					      cbr_regno VARCHAR(50) path '$.cbr_regno',
					      status_cd VARCHAR(3) path '$.status_cd'
					    )) j
            WHERE j.cbr_nm = ?
						  AND j.cbr_brdt = ?
						  AND j.cbr_regno = ?
						  AND j.status_cd not in ('52','30') 
        order by insr_year desc `

    // const queryListIND = `SELECT insurance_uuid, user_uuid, insurance_no, user_nm, user_cd 
    //               , insr_year, insr_st_dt, insr_cncls_dt
    //               , insr_tot_amt, status_cd, cbr_cnt, cbr_data
    //               , FN_GET_CODENM('COM030', status_cd) AS status_nm
    //                 FROM TCAA0030A
    //                WHERE (user_nm = ? and user_birth = ? and user_regno = ?)
    //                OR (JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_nm'), JSON_ARRAY(?))
    //                AND JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_brdt'), JSON_ARRAY(?))
    //                AND JSON_CONTAINS(JSON_EXTRACT(cbr_data, '$[*].cbr_regno'), JSON_ARRAY(?)))
    //                order by insr_year desc`;

    const queryListJNT = `SELECT A.insurance_uuid, A.user_uuid, A.insurance_no, A.user_nm, A.user_cd 
                   , A.insr_year, A.insr_st_dt, A.insr_cncls_dt
                   , A.insr_tot_amt, A.status_cd, A.cbr_cnt, A.cbr_data, A.cons_data
                   , FN_GET_CODENM('COM030', A.status_cd) AS status_nm
                     FROM TCAA0030A A
                    LEFT JOIN TCOM0030A B
                      ON A.insr_year = B.base_year
                    AND A.user_cd = B.user_cd
                    AND A.business_cd = B.business_cd
                    WHERE A.user_nm = ? and A.corp_cnno = ?
                    order by A.insr_year desc`;


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
      user[0].user_birth = '';
      user[0].user_regno = '';
    }

    const [listData] = await db.query(queryList, params);
    
    const queryNewInsr = `
    SELECT CASE WHEN COUNT(aa.insurance_uuid) >= 1 THEN 'N'  ELSE 'Y' END AS data
    from
       (select t.insurance_uuid 
       FROM TCAA0030A t,
       json_table(t.cbr_data,
       '$[*]' columns (
         cbr_nm VARCHAR(50) path '$.cbr_nm',
         cbr_brdt VARCHAR(8) path '$.cbr_brdt',
         cbr_regno VARCHAR(50) path '$.cbr_regno',
         status_cd VARCHAR(3) path '$.status_cd'
       )) j
       WHERE t.business_cd = 'CAA'
         AND j.cbr_nm = ?
         AND j.cbr_brdt = ?
         AND j.cbr_regno = ?
         AND j.status_cd not in ('52','30') -- 개인전환,해지
         AND t.insr_year in (
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
                      C.ver desc )
        union all 
       select user_uuid 
         from tcaa0030a ta
         where user_nm = ?
           and user_birth = ?
            and user_regno = ?
            and status_cd not in ('20', '40') -- 해지, 기간종료
            AND insr_year in (
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
                C.ver desc )
            ) aa ;
    `
    // const queryNewInsr = `
    //   select
    //       CASE
    //         WHEN COUNT(a.insurance_uuid) >= 1 THEN 'N'
    //         ELSE 'Y'
    //       END AS data
    //   from
    //     tcaa0030a a
    //   where
    //     (a.user_uuid = ?
    //     OR (JSON_CONTAINS(JSON_EXTRACT(a.cbr_data, '$[*].cbr_nm'), JSON_ARRAY(?))
    //                AND JSON_CONTAINS(JSON_EXTRACT(a.cbr_data, '$[*].cbr_brdt'), JSON_ARRAY(?))
    //                AND JSON_CONTAINS(JSON_EXTRACT(a.cbr_data, '$[*].cbr_regno'), JSON_ARRAY(?))))
    //     and a.status_cd not in ('20', '40') -- 해지, 기간종료
    //     and a.insr_year in (
    //         select
    //           max(C.base_year)
    //         from
    //           TCOM0030A C,
    //           tcom0110a D
    //         where
    //           C.user_cd = D.user_cd
    //           and C.business_cd = D.business_cd
    //           and C.use_yn = 'Y'
    //           and D.user_uuid = ?
    //         order by
    //           C.base_year desc,
    //           C.ver desc
    //     )
    // `;

    const queryNewInsrParams = [user[0].user_nm, user[0].user_birth, user[0].user_regno, user_uuid, user[0].user_nm, user[0].user_birth, user[0].user_regno, user_uuid];
    const newInsrData = await db.query(queryNewInsr, queryNewInsrParams);


    // const queryRenewalInsrIND = `
    //   select
    //     A.insurance_uuid as data, A.insr_year
    //   from
    //     tcaa0031a A,
    //     tcom0110a B
    //   where
    //     A.business_cd = B.business_cd
    //     and A.user_cd = 'IND' AND A.USER_NM = B.USER_NM and A.user_birth = B.user_birth and a.user_regno  = b.user_regno
    //     and B.user_uuid = ?
    //     and a.insr_year in (
    //         select
    //           max(C.base_year)
    //         from
    //           TCOM0030A C,
    //           tcom0110a D
    //         where
    //           C.user_cd = D.user_cd
    //           and C.business_cd = D.business_cd
    //           and C.use_yn = 'Y'
    //           and D.user_uuid = ?
    //         order by
    //           C.base_year desc,
    //           C.ver desc
    //     ) limit 1;
    // `;

    const queryRenewalInsrJNT = `
      select
        A.insurance_uuid as data, A.insr_year
      from
        tcaa0031a A,
        tcom0110a B
      where
        A.business_cd = B.business_cd
        and ((A.user_cd = 'IND' AND A.USER_NM = B.USER_NM and A.user_birth = B.user_birth and a.user_regno  = b.user_regno)
             or ((A.user_cd = 'JNT' or A.user_cd = 'COR') AND A.corp_cnno = B.corp_cnno )
             or ((A.user_cd = 'JNT' or A.user_cd = 'COR') AND JSON_CONTAINS(JSON_EXTRACT(a.cbr_data, '$[*].cbr_nm'), JSON_ARRAY(B.USER_NM))
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

    let queryRenewalInsr = queryRenewalInsrJNT;
    // if(user[0].user_cd == 'IND'){
    //   queryRenewalInsr = queryRenewalInsrIND;
    // }else {
    //   queryRenewalInsr = queryRenewalInsrJNT;
    // }

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

  selectHistory: async function (req) {
    //const params = { user_uuid: req.decoded.uuid, insurance_uuid: req.body.params.insurance_uuid };
    const params = req.body.params
    const queryParams = [
      params.insurance_uuid
    ];  
    const queryInsrInfo = `
      SELECT A.*
            ,B.insr_st_dt as base_insr_st_dt
            ,B.insr_cncls_dt as base_insr_cncls_dt
            ,B.insurance_no
      FROM   TCAA0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE A.insurance_uuid = ?
      ORDER  BY A.insurance_uuid DESC
      LIMIT  1 `;
      const [rowsInsrInfo] = await db.query(queryInsrInfo, queryParams);
      
      if (rowsInsrInfo.length < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
  
      return Object.setPrototypeOf(rowsInsrInfo, []);
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
          insr_pblc_brdn_rt,
          insr_clm_lt_amt,
          insr_psnl_brdn_amt,
          IFNULL(NULLIF(insr_sale_year, ''), 0) as insr_sale_year,
          IFNULL(NULLIF(insr_sale_rt, ''), 0) as insr_sale_rt
        from
          TCAA0031A
        where business_cd = ?
          and user_cd = 'IND'
          and user_nm = ?
          and user_birth = ?
          and user_regno = ?
          and insr_year = ?
    `
    const queryParamsDataTWO = [
      params.insr_year,
      params.user_nm,
      params.user_birth,
      params.user_regno,
    ];

    const queryDataTWO = `
    SELECT
      t.user_cd,
      j.cbr_nm AS user_nm,
      j.cbr_brdt AS user_birth,
      j.cbr_regno AS user_regno,
      j.insr_retr_dt AS insr_retr_dt,
      COALESCE(j.insr_sale_year, 0) AS insr_sale_year,
      COALESCE(j.insr_sale_rt, 0) AS insr_sale_rt
    FROM
      tCAA0031a t
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
      params.user_cd,
      params.user_nm,
      params.user_birth,
      params.user_regno,
      params.insr_year,
    ];
    const queryDataDup = `
        SELECT COUNT(*) AS cnt
        FROM (
            SELECT 1
            FROM TCAA0030A
            WHERE business_cd = ?
              AND user_cd = 'IND'
              AND user_nm = ?
              AND user_birth = ?
              AND user_regno = ?
              AND insr_year = ?
              AND status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
            UNION ALL
            SELECT 1
            FROM TCAA0030A t,
            json_table(t.cbr_data,
            '$[*]' columns (
              cbr_nm VARCHAR(50) path '$.cbr_nm',
              cbr_brdt VARCHAR(8) path '$.cbr_brdt',
              cbr_regno VARCHAR(50) path '$.cbr_regno',
              status_cd VARCHAR(3) path '$.status_cd'
            )) j
            WHERE t.business_cd = ?
              AND t.user_cd = ?
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
        [resultData] = await db.query(queryDataTWO, queryParamsDataTWO)
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
    const params = req.body.params;
    let query = '';
    let queryparam ;

    if(params.user_cd=='IND'){
      query = `select COUNT(*) cnt from tcaa0030a where user_regno = ? and user_nm = ? and insr_year = ? and user_cd = ?`
      queryparam = [params.user_regno, params.user_nm, params.insr_year, params.user_cd ];
    }else{
      query = `select COUNT(*) cnt from tcaa0030a where corp_cnno = ? and user_nm = ? and insr_year = ? and user_cd = ?`
      queryparam = [params.corp_cnno, params.user_nm, params.insr_year, params.user_cd ];
    }

    const [rows] = await db.query(query, queryparam);

    if (rows.length < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    logger.debug(rows[0].cnt);
    if (rows[0].cnt > 0) {
      return true;
    }

    return false;
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;

    const params = req.body.params;

    const query = `INSERT INTO TCAA0030A (
                      insurance_uuid, user_uuid, insurance_no, business_cd, user_cd, user_id, user_nm, user_birth,
                      user_regno, corp_type, corp_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno, corp_ceo_nm,
                      corp_cust_nm, corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl,corp_region_cd,
                      insr_year, insr_reg_dt, insr_st_dt, insr_cncls_dt, insr_retr_yn, insr_retr_dt,
                      insr_pblc_brdn_rt , insr_clm_lt_amt, insr_year_clm_lt_amt, insr_psnl_brdn_amt, 
                      insr_sale_year, insr_sale_rt, insr_pcnt_sale_rt, insr_base_amt, insr_amt, insr_tot_amt, 
                      insr_tot_paid_amt, insr_tot_unpaid_amt, cons_join_yn, cons_data, cbr_cnt, cbr_data,
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
      params.cons_join_yn,
      JSON.stringify(params.cons_data),
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
    const queryIND = ` UPDATE TCAA0030A 
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
                      insr_pblc_brdn_rt = ?,
                      insr_clm_lt_amt = ?,
                      insr_year_clm_lt_amt = ?,
                      insr_psnl_brdn_amt = ?,
                      insr_sale_rt = ?,
                      insr_pcnt_sale_rt = ?,
                      insr_base_amt = ?,
                      insr_amt = ?,
                      insr_tot_amt = ?,
                      insr_tot_paid_amt = ?,
                      insr_tot_unpaid_amt = ?,
                      cons_join_yn = ?,
                      cons_data = ?,
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
    const queryJNT = ` UPDATE TCAA0030A 
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
                    insr_sale_rt = ?,
                    insr_pcnt_sale_rt = ?,
                    insr_base_amt = ?,
                    insr_amt = ?,
                    insr_tot_amt = ?,
                    insr_tot_paid_amt = ?,
                    insr_tot_unpaid_amt = ?,
                    cons_join_yn = ?,
                    cons_data = ?,
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
        params.insr_pblc_brdn_rt,
        params.insr_clm_lt_amt,
        params.insr_year_clm_lt_amt,
        params.insr_psnl_brdn_amt,
        params.insr_sale_rt,
        params.insr_pcnt_sale_rt,
        params.insr_base_amt,
        params.insr_amt,
        params.insr_tot_amt,
        params.insr_tot_paid_amt,
        params.insr_tot_unpaid_amt,
        params.cons_join_yn,
        JSON.stringify(params.cons_data),
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
        params.insr_pblc_brdn_rt,
        params.insr_clm_lt_amt,
        params.insr_year_clm_lt_amt,
        params.insr_psnl_brdn_amt,
        params.insr_sale_rt,
        params.insr_pcnt_sale_rt,
        params.insr_base_amt,
        params.insr_amt,
        params.insr_tot_amt,
        params.insr_tot_paid_amt,
        params.insr_tot_unpaid_amt,
        params.cons_join_yn,
        JSON.stringify(params.cons_data),
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
    const query = 'DELETE FROM TCAA0030A WHERE insurance_uuid = ? AND user_uuid = ?';
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
    const query = `UPDATE TCAA0030A SET corp_type=?, corp_nm=?, corp_ceo_nm=?, corp_bnno=?, corp_cnno=?, corp_telno=?, corp_faxno=?
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

};
