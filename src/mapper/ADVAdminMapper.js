module.exports = Object.freeze({
  /**
   * [보험DB] 신규가입 가능여부 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_ADV_RATE_TOP: `SELECT base_year,
      ver,
      user_cd,
      business_cd,
      insr_st_dt,
      insr_cncls_dt,
      days,
      insurance_nm,
      contents,
      insurance_no
    FROM   tcom0030a
    WHERE  user_cd = ?
        AND business_cd = ?
        AND use_yn = 'Y'
    ORDER  BY base_year DESC,
            ver DESC
    LIMIT  1  
    `,

  /**
   * [보험DB] 신규가입 가능여부 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_UUID_YN: `
      /* AdminMapper.INSURANCE_UUID_YN */    
      select
          CASE
            WHEN COUNT(a.insurance_uuid) >= 1 THEN 'N'
            ELSE 'Y'
          END AS data
      from
        ttax0030a a
      where
        a.user_uuid = :user_uuid
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
              and D.user_uuid = :user_uuid
            order by
              C.base_year desc,
              C.ver desc
        )
    `,

  /**
   * [보험DB] 신규가입 가능여부 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_STATUS: `
    /* AdminMapper.INSURANCE_STATUS */    
    SELECT insurance_uuid
            , insurance_seq
            , user_uuid
            , insurance_no
            , user_nm
            , insr_year
            , insr_st_dt
            , insr_cncls_dt
            , insr_tot_amt
            , status_cd
      FROM   ttax0030a
      WHERE  user_uuid = :user_uuid
      ORDER  BY insurance_uuid, insurance_seq DESC
      LIMIT  1 
    `,
  /**
   * [보험DB - ADV] 보험 데이터 조회 엑셀용
   *
   */
  INSURANCE_ADV_EXCEL_LIST: `
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
            ,A.limited_collateral
            ,FN_GET_CODENM('COM030', A.status_cd) AS status_nm
            ,FN_GET_CODENM('ADV001', A.corp_region_cd) AS corp_region_nm
            ,B.insr_st_dt as base_insr_st_dt
            ,B.insr_cncls_dt as base_insr_cncls_dt
            ,B.insurance_no
      FROM   TADV0030A A    
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE  A.business_cd = ?
         AND A.user_cd = ?
         AND (A.insr_year like CONCAT('%', ?, '%'))
         AND (? = '%' or A.status_cd = ?)
         AND (A.user_nm like CONCAT('%', ?, '%'))
      ORDER  BY A.insr_year DESC ,A.created_at DESC
    `,

  /**
   * [보험DB] 목록 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_ADV_LIST: `SELECT A.insurance_uuid
    , A.business_cd
    , A.user_cd
    , A.user_uuid
    , A.user_nm
    , A.user_id
    , A.user_regno
    , A.corp_cnno
    , A.insr_year
    , A.insr_st_dt
    , A.insr_cncls_dt
    , A.insr_tot_amt
    , A.insr_tot_paid_amt
    , A.insr_tot_unpaid_amt
    , A.status_cd
    , B.insurance_no
    , B.insr_st_dt as base_insr_st_dt
    , B.insr_cncls_dt as base_insr_cncls_dt
    , FN_GET_CODENM('COM002', A.user_cd) AS user_cd_nm
    , FN_GET_CODENM('COM030', A.status_cd) AS status_nm
    , FN_GET_CODENM('ADV001', A.corp_region_cd) AS corp_region_nm
    FROM TADV0030A A
    LEFT JOIN TCOM0030A B
  ON A.insr_year = B.base_year 
  AND A.user_cd = B.user_cd 
  AND A.business_cd = B.business_cd
  WHERE  A.business_cd =  ?
  AND (? = '%' or A.user_cd = ?)
  AND (? = '%' or A.insr_year = ?)
  AND (? = '%' or A.status_cd = ?)
  AND ((A.user_nm like CONCAT('%', ?, '%')) OR a.cbr_data like CONCAT('%', ?, '%') )
  ORDER  BY A.insr_year DESC ,A.created_at DESC
  `,

  /**
   * [보험DB] 상세 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  INSURANCE_ADV_INFO: `SELECT A.insurance_uuid
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
  ,A.erp_amt
  ,A.erp_dt
  ,A.erp_st_dt
  ,A.erp_cncls_dt
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
  ,A.limited_collateral
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
FROM   TADV0030A A
    LEFT JOIN TCOM0030A B
ON A.insr_year = B.base_year 
AND A.user_cd = B.user_cd 
AND A.business_cd = B.business_cd
WHERE A.insurance_uuid = ?
    AND A.status_cd not in ('40') -- 이력제외
ORDER  BY A.insurance_uuid DESC
LIMIT  1
`,

  /**
   * [보험DB] 상세 이력 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  INSURANCE_INFO_HISTORY: `
      /* AdminMapper.INSURANCE_INFO_HISTORY */    
      SELECT A.insurance_uuid
            ,A.insurance_seq
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
            ,A.insr_pblc_brdn_rt
            ,A.insr_clm_lt_amt
            ,A.insr_year_clm_lt_amt
            ,A.insr_psnl_brdn_amt
            ,A.insr_sale_year
            ,A.insr_sale_rt
            ,A.insr_pcnt_sale_rt
            ,A.insr_base_amt
            ,A.insr_amt
            ,A.insr_tot_amt
            ,A.insr_tot_paid_amt
            ,A.insr_tot_unpaid_amt
            ,A.cons_join_yn
            ,A.cons_data
            ,A.spct_join_yn
            ,A.spct_data
            ,A.cbr_data
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
            ,B.insr_st_dt AS base_insr_st_dt
            ,B.insr_cncls_dt AS base_insr_cncls_dt
            ,B.insurance_no
      FROM   TTAX0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE A.insurance_uuid = :insurance_uuid 
            AND A.user_uuid = :user_uuid 
            AND A.status_cd not in ('40') -- 이력제외
      ORDER  BY insurance_uuid, insurance_seq DESC
    `,

  /**
   * [보험DB - ADV] 입력
   */
  INSERT_ADV_INSURANCE: `INSERT INTO tadv0030a
            (insurance_uuid,
             user_uuid,
             insurance_no,
             business_cd,
             user_cd,
             user_id,
             user_nm,
             user_birth,
             user_regno,
             corp_type,
             corp_nm,
             corp_bnno,
             corp_cnno,
             corp_telno,
             corp_faxno,
             corp_cust_nm,
             corp_cust_hpno,
             corp_cust_email,
             corp_post,
             corp_addr,
             corp_addr_dtl,
             corp_region_cd,
             insr_year,
             insr_reg_dt,
             insr_st_dt,
             insr_cncls_dt,
             insr_retr_yn,
             insr_retr_dt,
             insr_take_amt,
             insr_take_sec,
             insr_clm_lt_amt,
             insr_year_clm_lt_amt,
             insr_psnl_brdn_amt,
             insr_sale_year,
             insr_sale_rt,
             insr_pcnt_sale_rt,
             insr_base_amt,
             insr_amt,
             insr_tot_amt,
             insr_tot_paid_amt,
             insr_tot_unpaid_amt,
             active_yn,
             agr10_yn,
             agr20_yn,
             agr30_yn,
             agr31_yn,
             agr32_yn,
             agr33_yn,
             agr34_yn,
             agr40_yn,
             agr41_yn,
             agr50_yn,
             status_cd,
             rmk,
              erp_amt,
              erp_dt,
              erp_st_dt,
              erp_cncls_dt,
             change_rmk,
             change_dt,
             created_id,
             created_ip,
             created_at,
             updated_id,
             updated_ip,
             updated_at,
             spct_join_yn,
             spct_data,
             cbr_cnt,
             cbr_data,
             trx_data,
             limited_collateral)
VALUES      ( UUID_V4(), ?, ?, ?, ?, 
              ?, ?, ?, ?, ?,  
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, now(), ?, ?, 
              now(), ?, ?, ?, ?, ?, ?) 
    `,

  /**
   * [보험DB] 수정
   */
  UPDATE_INSURANCE: `
    /* AdminMapper.UPDATE_ADV_INSURANCE */    
    UPDATE tadv0030a
    SET    insurance_no = ?,
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
          erp_amt = ?,
          erp_dt = ?,
          erp_st_dt = ?,
          erp_cncls_dt = ?,
          change_rmk = ?,
          change_dt = ?,
          updated_at = Now(),
          updated_id = ?,
          updated_ip = ?,
          limited_collateral = ?
    WHERE  insurance_uuid = ?
    `,

  /**
   * [보험DB] 입금정보 수정
   */
  UPDATE_INSURANCE_TRX_DATA: `
    /* AdminMapper.UPDATE_INSURANCE_TRX_DATA */    
    UPDATE ttax0030a
    SET    
          trx_data = :trx_data,
          status_cd = :status_cd,
          insr_tot_paid_amt = :insr_tot_paid_amt,
          insr_tot_unpaid_amt = :insr_tot_unpaid_amtf,
          updated_at = Now(),
          updated_id = :updated_id,
          updated_ip = :updated_ip
    WHERE  insurance_uuid = :insurance_uuid
    `,

  /**
   * [보험DB - ADV] 입금처리 조회
   *
   * - :user_uuid 사용자 KEY
   */
  SELECT_INSURANCE_ADV_TRX_DATA_LIST: `
      SELECT A.insurance_uuid
            , A.business_cd
            , A.user_cd
            , A.user_uuid
            , A.user_nm
            , A.user_id
            , A.user_regno
            , A.corp_cnno
            , A.insr_year
            , A.insr_st_dt
            , A.insr_cncls_dt
            , A.insr_tot_amt
            , A.insr_tot_paid_amt
            , A.insr_tot_unpaid_amt
            , A.status_cd
            , A.trx_data
            , B.insurance_no
            , B.insr_st_dt as base_insr_st_dt
            , B.insr_cncls_dt as base_insr_cncls_dt
            , FN_GET_CODENM('COM002', A.user_cd) AS user_cd_nm
            , FN_GET_CODENM('COM030', A.status_cd) AS status_nm
            , FN_GET_CODENM('ADV001', A.corp_region_cd) AS corp_region_nm
            FROM   TADV0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
        WHERE  A.business_cd = ?
         AND (? = '%' or A.user_cd = ?)
         AND (? = '%' or A.insr_year = ?)
         AND (? = '%' or A.status_cd = ?)
         AND ((A.user_nm like CONCAT('%', ?, '%')) OR a.cbr_data like CONCAT('%', ?, '%') )
      ORDER  BY A.insr_year DESC ,A.created_at DESC
    `,

  /**
   * [보험DB - ADV] 입금처리
   */
  UPDATE_INSURANCE_ADV_TRX_DATA: `
    UPDATE tadv0030a
    SET
      trx_data = :trx_data,
      status_cd = :status_cd,
      insr_tot_paid_amt = :insr_tot_paid_amt,
      insr_tot_unpaid_amt = :insr_tot_unpaid_amt,
      updated_at = Now(),
      updated_id = :updated_id,
      updated_ip = :updated_ip
    WHERE  insurance_uuid = :insurance_uuid
    `,

  /**
   * [보험DB - ADV] 삭제
   */
  DELETE_ADV_INSURANCE: `
      DELETE FROM tadv0030a WHERE insurance_uuid = ? AND user_uuid = ?
    `,

  /**
   * [갱신DB] 보험_UUID 조회
   *
   * - :user_uuid 사용자 KEY
   */
  RENEWAL_ADV_INSURANCE_UUID: `
    SELECT MAX(A.insurance_uuid) as data
      FROM tadv0031a A
      JOIN tcom0110a B
        ON A.business_cd = B.business_cd
        AND A.user_cd = B.USER_CD
        AND (
          (A.user_cd = 'IND' AND A.USER_NM = B.USER_NM AND A.user_birth = B.user_birth AND a.user_regno  = b.user_regno)
          OR (A.user_cd = 'COR' AND A.corp_cnno = B.corp_cnno)
        )
        AND B.user_uuid = :user_uuid
        AND a.insr_year IN (
          SELECT MAX(C.base_year)
          FROM TCOM0030A C
          JOIN tcom0110a D
            ON C.user_cd = D.user_cd
            AND C.business_cd = D.business_cd
            AND C.use_yn = 'Y'
            AND D.user_uuid = :user_uuid
          ORDER BY C.base_year DESC, C.ver DESC
        )
    `,

  /**
   * [갱신DB - ADV] 보험 상세 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  RENEWAL_INSURANCE_ADV_INFO: `SELECT A.insurance_uuid
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
  FROM   TADV0031A A
    LEFT JOIN TCOM0030A B
  ON A.insr_year = B.base_year 
  AND A.user_cd = B.user_cd 
  AND A.business_cd = B.business_cd
  WHERE A.insurance_uuid = ?
    AND A.status_cd not in ('40') -- 이력제외
  ORDER  BY A.insurance_uuid DESC
  LIMIT  1 
  `,
  /**
   * [보험DB - ADV] 목록 조회
   *
   * - :user_uuid 사용자 KEY
   */
  RENEWAL_INSURANCE_ADV_LIST: `SELECT A.insurance_uuid
    , A.business_cd
    , A.user_cd
    , A.user_uuid
    , A.user_nm
    , A.user_id
    , A.user_regno
    , A.corp_cnno
    , A.insr_year
    , A.insr_st_dt
    , A.insr_cncls_dt
    , A.insr_tot_amt
    , A.status_cd
    , B.insurance_no
    , FN_GET_CODENM('COM002', A.user_cd) AS user_cd_nm
    , FN_GET_CODENM('COM030', A.status_cd) AS status_nm
    , FN_GET_CODENM('ADV001', A.corp_region_cd) AS corp_region_nm
  FROM   TADV0031A A
    LEFT JOIN TCOM0030A B
  ON A.insr_year = B.base_year 
  AND A.user_cd = B.user_cd 
  AND A.business_cd = B.business_cd
  WHERE  A.business_cd = ?
  AND (? = '%' or A.user_cd = ?)
  AND (? = '%' or A.insr_year = ?)
  AND (? = '%' or A.status_cd = ?)
  AND ((A.user_nm like CONCAT('%', ?, '%')) OR a.cbr_data like CONCAT('%', ?, '%') )
  ORDER  BY A.insr_year DESC ,A.created_at DESC
  `,

  /**
   * [갱신DB - ADV] 입력
   */
  INSERT_RENEWAL_ADV_INSURANCE: `
      INSERT INTO tadv0031a
            (insurance_uuid,
             user_uuid,
             insurance_no,
             business_cd,
             user_cd,
             user_id,
             user_nm,
             user_birth,
             user_regno,
             corp_type,
             corp_nm,
             corp_bnno,
             corp_cnno,
             corp_telno,
             corp_faxno,
             corp_cust_nm,
             corp_cust_hpno,
             corp_cust_email,
             corp_post,
             corp_addr,
             corp_addr_dtl,
             corp_region_cd,
             insr_year,
             insr_reg_dt,
             insr_st_dt,
             insr_cncls_dt,
             insr_retr_yn,
             insr_retr_dt,
             insr_take_amt,
             insr_take_sec,
             insr_clm_lt_amt,
             insr_year_clm_lt_amt,
             insr_psnl_brdn_amt,
             insr_sale_year,
             insr_sale_rt,
             insr_pcnt_sale_rt,
             insr_base_amt,
             insr_amt,
             insr_tot_amt,
             insr_tot_paid_amt,
             insr_tot_unpaid_amt,
             active_yn,
             agr10_yn,
             agr20_yn,
             agr30_yn,
             agr31_yn,
             agr32_yn,
             agr33_yn,
             agr34_yn,
             agr40_yn,
             agr41_yn,
             agr50_yn,
             status_cd,
             rmk,
             change_rmk,
             change_dt,
             created_id,
             created_ip,
             created_at,
             updated_id,
             updated_ip,
             updated_at,
             spct_join_yn,
             spct_data,
             cbr_cnt,
             cbr_data,
             trx_data)
VALUES      ( UUID_V4(), ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, now(), ?,
              ?, now(), ?, ?, ?, ?, ?)
    `,

  /**
   * [갱신DB - ADV] 수정
   */
  UPDATE_RENEWAL_ADV_INSURANCE: `
    /*  */    
    UPDATE tadv0031a
    SET    insurance_no = ?,
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
          updated_at = Now(),
          updated_id = ?,
          updated_ip = ?
    WHERE  insurance_uuid = ?
    `,

  /**
   * [갱신DB - ADV] 삭제
   */
  DELETE_RENEWAL_ADV_INSURANCE: `
      /* AdminMapper.DELETE_RENEWAL_INSURANCE */    
      DELETE FROM tadv0031a WHERE insurance_uuid = ?
    `,

  /**
   * [변경요청DB - ADV] 목록 조회
   */
  SELECT_APPLY_ADV_INSURANCE_LIST: `
      SELECT 
        a.*,
        (
          select 
            max(insurance_no) 
          from 
            tcom0030a 
          where 
            business_cd = b.business_cd 
            and user_cd = b.user_cd 
            and base_year = b.insr_year
        ) as insr_insurance_no, 
        b.insr_year, 
        b.insr_st_dt, 
        b.insr_cncls_dt, 
        b.user_nm, 
        b.user_regno, 
        b.corp_cnno, 
        FN_GET_CODENM('COM040', a.apply_cd) AS apply_nm,
        FN_GET_CODENM('COM041', a.proc_cd) AS proc_nm 
      FROM 
        TADV0040A a LEFT OUTER JOIN TADV0030A b 
        ON a.insurance_uuid = b.insurance_uuid
      WHERE  a.business_cd = ?
        AND (? = '%' or a.proc_cd = ?)
        AND (b.user_nm like CONCAT('%', ?, '%'))
      order by a.apply_no DESC
    `,

  /**
   * [변경요청DB - ADV] 수정 조회
   */
  UPDATE_APPLY_ADV_INSURANCE: `
      update
        TADV0040A
      set
        proc_dt = ?,
        proc_content = ?,
        proc_cd = ?
      where
        apply_no = ?
    `
});
