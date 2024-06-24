module.exports = Object.freeze({
  /**
   * [보험DB] 증권 정보 조회
   *
   * - :user_uuid 사용자 KEY
   */
  INSURANCE_RENEWAL_LIST: `
    /* AdminMasterMapper.INSURANCE_RENEWAL_LIST */    
    SELECT base_year,
          ver,
          user_cd,
          business_cd,
          insr_st_dt,
          insr_cncls_dt,
          days,
          insurance_nm,
          contents,
          insurance_no
    FROM  tcom0030a
    WHERE business_cd = :business_cd
      AND use_yn = 'Y'
      and now() between CONCAT (rn_st_dt,' 00:00:00') and CONCAT(rn_en_dt,' 23:59:59')
    ORDER BY base_year DESC,
      ver desc;
    `,

});
