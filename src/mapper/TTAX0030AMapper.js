module.exports = Object.freeze({
  /**
   * [보험DB] 신규가입 가능여부 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_UUID_YN: `
      /* TTAX0030AMapper.INSURANCE_UUID_YN */  
      select
          CASE
            WHEN COUNT(a.insurance_uuid) >= 1 THEN 'N'
            ELSE 'Y'
          END AS data
      from ttax0030a a
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
      /* TTAX0030AMapper.INSURANCE_STATUS */  
      SELECT a.insurance_uuid
            , a.insurance_seq
            , a.user_uuid
            , a.user_nm
            , a.insr_year
            , a.insr_st_dt
            , a.insr_cncls_dt
            , a.insr_tot_amt
            , a.status_cd
            , b.insurance_no
      FROM   ttax0030a a, tcom0030a b
      WHERE  a.insr_year = b.base_year
             and a.business_cd = b.business_cd
             and a.user_cd = b.user_cd
             and a.user_uuid = :user_uuid
             and b.use_yn = 'Y'
      ORDER  BY a.created_at DESC 
      LIMIT  1 
    `,

  /**
   * [보험DB] 신규가입 가능여부 조회
   *
   */
  INSURANCE_DUP_CNT: `
      /* TTAX0030AMapper.INSURANCE_DUP_CNT */  

      SELECT COUNT(*) AS cnt
      FROM (
          SELECT 1
          FROM TTAX0030A
          WHERE business_cd = :business_cd
            AND user_cd = 'IND'
            AND user_nm = :user_nm
            AND user_birth = :user_birth
            AND user_regno = :user_regno
            AND insr_year = :insr_year
            AND status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
          UNION ALL
          SELECT 1
          FROM TTAX0030A t,
          json_table(t.cbr_data,
          '$[*]' columns (
            cbr_nm VARCHAR(50) path '$.cbr_nm',
            cbr_brdt VARCHAR(8) path '$.cbr_brdt',
            cbr_regno VARCHAR(50) path '$.cbr_regno',
            status_cd VARCHAR(3) path '$.status_cd'
          )) j
          WHERE t.business_cd = :business_cd
            AND t.user_cd = 'COR'
            AND j.cbr_nm = :user_nm
            AND j.cbr_brdt = :user_birth
            AND j.cbr_regno = :user_regno 
            AND j.status_cd in ('10', '20', '80') -- 신청중, 처리중, 정상
            AND t.insr_year = :insr_year
      ) AS cnt
    `,

  /**
   * [보험DB] 목록 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_LIST: `
      /* TTAX0030AMapper.INSURANCE_LIST */  
      SELECT A.insurance_uuid
            , A.user_uuid
            , A.user_nm
            , A.insr_year
            , A.insr_st_dt
            , A.insr_cncls_dt
            , A.insr_tot_amt
            , A.status_cd
            , B.insurance_no
            , FN_GET_CODENM('COM030', status_cd) AS status_nm
            , B.use_yn
            , B.rn_st_dt 
            , B.rn_en_dt 
        FROM   TTAX0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE  A.user_uuid = :user_uuid
             and A.status_cd not in ('40') -- 이력 제외
      ORDER  BY A.created_at DESC 
    `,

  /**
   * [보험DB] 상세 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  INSURANCE_INFO: `
      /* TTAX0030AMapper.INSURANCE_INFO */  

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
            ,FN_GET_CODENM('TAX001', A.corp_region_cd) AS corp_region_nm
            ,FN_GET_SPLIT(A.corp_telno, '-', 1) as corp_telno1
            ,FN_GET_SPLIT(A.corp_telno, '-', 2) as corp_telno2
            ,FN_GET_SPLIT(A.corp_telno, '-', 3) as corp_telno3
            ,FN_GET_SPLIT(A.corp_faxno, '-', 1) as corp_faxno1
            ,FN_GET_SPLIT(A.corp_faxno, '-', 2) as corp_faxno2
            ,FN_GET_SPLIT(A.corp_faxno, '-', 3) as corp_faxno3
            ,B.insr_st_dt as base_insr_st_dt
            ,B.insr_cncls_dt as base_insr_cncls_dt
            ,B.insurance_no
      FROM   TTAX0030A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE A.insurance_uuid = :insurance_uuid 
           -- AND A.user_uuid = :user_uuid 
            AND A.status_cd not in ('40') -- 이력제외
      ORDER  BY A.insurance_uuid, A.insurance_seq DESC
      LIMIT  1 
    `,

  /**
   * [보험DB] 상세 이력 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  INSURANCE_INFO_HISTORY: `
      /* TTAX0030AMapper.INSURANCE_INFO_HISTORY */  

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
            ,FN_GET_CODENM('TAX001', A.corp_region_cd) AS corp_region_nm
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
            -- AND A.user_uuid = :user_uuid 
      ORDER  BY insurance_uuid, insurance_seq DESC
    `,

  /**
   * [보험DB] 로그인 시 보험계약정보 매핑
   *
   * - :insurance_uuid 보험 KEY
   */
  UPDATE_INSURANCE_MAPPING_WITH_LOGIN_INFO: `
      /* TTAX0030AMapper.UPDATE_INSURANCE_MAPPING_WITH_LOGIN_INFO */  
      UPDATE ttax0030a
      SET
          user_id = :user_id,
          user_uuid = :user_uuid,
          updated_at = NOW(),
          updated_id = :updated_id,
          updated_ip = :updated_ip
      WHERE
          business_cd = :business_cd
          AND user_cd = :user_cd
          AND (
              (
                  'IND' = :user_cd
                  AND user_nm = :user_nm
                  AND user_birth = :user_birth
                  AND user_regno = :user_regno
              )
              OR (
                  'COR' = :user_cd
                  AND corp_cnno = :corp_cnno
              )
          )
    `,

  /**
   * [갱신DB] 보험_UUID 조회
   *
   * - :user_uuid 사용자 KEY
   */
  RENEWAL_INSURANCE_UUID: `
    /* TTAX0030AMapper.RENEWAL_INSURANCE_UUID */

    SELECT MAX(A.insurance_uuid) as data
      FROM ttax0031a A
      join tcom0030a ta
        on A.business_cd = ta.business_cd
        and A.user_cd = ta.USER_CD
        and a.insr_year = ta.base_year
        and now() between CONCAT (ta.rn_st_dt,' 00:00:00') and CONCAT(ta.rn_en_dt,' 23:59:59')
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
   * [갱신DB] 보험 상세 조회
   *
   * - :insurance_uuid 보험 KEY
   */
  RENEWAL_INSURANCE_INFO: `
      /* TTAX0030AMapper.RENEWAL_INSURANCE_INFO */

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
            ,FN_GET_CODENM('TAX001', A.corp_region_cd) AS corp_region_nm
            ,FN_GET_SPLIT(A.corp_telno, '-', 1) as corp_telno1
            ,FN_GET_SPLIT(A.corp_telno, '-', 2) as corp_telno2
            ,FN_GET_SPLIT(A.corp_telno, '-', 3) as corp_telno3
            ,FN_GET_SPLIT(A.corp_faxno, '-', 1) as corp_faxno1
            ,FN_GET_SPLIT(A.corp_faxno, '-', 2) as corp_faxno2
            ,FN_GET_SPLIT(A.corp_faxno, '-', 3) as corp_faxno3
            ,B.insr_st_dt as base_insr_st_dt
            ,B.insr_cncls_dt as base_insr_cncls_dt
            ,B.insurance_no
      FROM   TTAX0031A A
      			LEFT JOIN TCOM0030A B
		    ON A.insr_year = B.base_year 
		    AND A.user_cd = B.user_cd 
		    AND A.business_cd = B.business_cd
      WHERE A.insurance_uuid = :insurance_uuid 
            AND A.status_cd not in ('40') -- 이력제외
      ORDER  BY A.insurance_uuid, A.insurance_seq DESC
      LIMIT  1 
    `,

  /**
   * [갱신DB] 개인 할인 할증 조회
   *
   */
  RENEWAL_INSURANCE_IND_SALE_RT_INFO: `
        /* TTAX0030AMapper.RENEWAL_INSURANCE_IND_SALE_RT_INFO */

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
          TTAX0031A
        where business_cd = :business_cd
          and user_cd = 'IND'
          and user_nm = :user_nm
          and user_birth = :user_birth
          and user_regno = :user_regno
          and insr_year = :insr_year
    `,

  /**
   * [갱신DB] 개인 할인 할증 조회
   *
   */
  RENEWAL_INSURANCE_COR_SALE_RT_INFO: `
      /* TTAX0030AMapper.RENEWAL_INSURANCE_COR_SALE_RT_INFO */

        select
          t.user_cd,
          t.corp_bnno,
          j.cbr_nm as user_nm,
          j.cbr_brdt as user_birth,
          j.cbr_regno as user_regno,
          j.insr_retr_dt,
          t.insr_pblc_brdn_rt,
          t.insr_clm_lt_amt,
          t.insr_psnl_brdn_amt,
          IFNULL(NULLIF(j.insr_sale_year, ''), 0) as insr_sale_year,
          IFNULL(NULLIF(j.insr_sale_rt, ''), 0) as insr_sale_rt
        from
          TTAX0031A t,
          json_table(t.cbr_data,
          '$[*]' columns (
            cbr_nm VARCHAR(50) path '$.cbr_nm',
          cbr_brdt VARCHAR(8) path '$.cbr_brdt',
          cbr_type VARCHAR(20) path '$.cbr_type',
          cbr_regno VARCHAR(50) path '$.cbr_regno',
          insr_retr_dt VARCHAR(10) path '$.insr_retr_dt',
          insr_sale_year decimal(4,0) path '$.insr_sale_year',
          insr_sale_rt decimal(3,0) path '$.insr_sale_rt'
        )) j
        where
          t.business_cd = :business_cd
          and t.user_cd = 'COR'
          and j.cbr_nm = :user_nm
          and j.cbr_brdt = :user_birth
          and j.cbr_regno = :user_regno
          and t.insr_year = :insr_year
    `,
  /**
   * [명단DB] 회원 여부 조회
   *
   */
  TCOM0111A_MBR_CNT: `
    /* TTAX0030AMapper.TCOM0111A_MBR_CNT */

    SELECT count(*) AS cnt
          FROM   tcom0111a
          WHERE  business_cd = :business_cd
                AND nm = :user_nm
                AND reg_no = :user_regno
    `
});
