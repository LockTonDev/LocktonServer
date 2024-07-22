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
  INSURANCE_LIST: `
  /* AdminMapper.INSURANCE_LIST */    
    SELECT base_year,
          ver,
          user_cd,
          FN_GET_CODENM('COM002', user_cd) AS user_cd_nm,
          business_cd,
          FN_GET_CODENM('COM001', business_cd) AS business_cd_nm,
          insr_st_dt,
          insr_cncls_dt,
          days,
          insurance_nm,
          contents,
          insurance_no,
          use_yn,
          rn_st_dt,
          rn_en_dt,
          created_at ,
          updated_at
     FROM tcom0030a 
    WHERE (? = '%' or business_cd = ?)
      AND (? = '%' or user_cd = ?)
      AND (? = '%' or base_year = ?)
    ORDER BY business_cd, user_cd, base_year DESC, ver DESC`
    ,
  INSURANCE_INSERT: `
  /* AdminMapper.INSURANCE_INSERT */    
   insert into tcom0030a
          ( base_year,
            ver,
            user_cd,
            business_cd,
            insr_st_dt,
            insr_cncls_dt,
            days,
            insurance_nm,
            contents,
            insurance_no,
            use_yn,
            rn_st_dt,
            rn_en_dt,
            created_id,
            created_at,
            updated_id,
            updated_at )
        VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, now(), ?, now())` ,
    INSURANCE_UPDATE: `
    /* AdminMapper.INSURANCE_UPDATE */   
      update tcom0030a
        set insr_st_dt = ?,
            insr_cncls_dt = ?,
            days = ?,
            insurance_nm = ?,
            contents = ?,
            insurance_no = ?,
            use_yn = ?,
            rn_st_dt = ?,
            rn_en_dt = ?,
            updated_id = ?,
            updated_at = now()
      where base_year = ?
        and ver = ?
        and user_cd = ?
        and business_cd = ? `,
    INSURANCE_DELETE: `
    /* AdminMapper.INSURANCE_DELETE */   
     delete from tcom0030a
      where base_year = ?
        and ver = ?
        and user_cd = ?
        and business_cd = ? `,
    INSURANCE_SELECT_DUP: `
    /* AdminMapper.INSURANCE_SELECT_DUP */   
      select count(*) cnt
       from tcom0030a
      where base_year = ?
        and ver = ?
        and user_cd = ?
        and business_cd = ? `

 });
