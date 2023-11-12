module.exports = Object.freeze({
  /**
   * [회원DB] 목록 조회
   *
   */
  SELECT_USER_INFO: `
    /* AdminUserMapper.SELECT_USER_INFO */
    SELECT user_uuid,
          business_cd,
          user_cd,
          user_nm,
          user_birth,
          user_id,
          user_regno,
          user_hpno,
          user_email,
          corp_type,
          corp_nm,
          corp_ceo_nm,
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
          recv_email_yn,
          agr1_yn,
          agr2_yn,
          agr3_yn,
          agr4_yn,
          active_yn,
          status_cd,
          user_pwd_chg_at,
          rmk,
          login_fail_cnt,
          login_block_yn,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s')  as created_at,
          created_ip,
          updated_at,
          updated_ip
          , FN_GET_SPLIT(corp_telno, '-', 1) as corp_telno1
          , FN_GET_SPLIT(corp_telno, '-', 2) as corp_telno2
          , FN_GET_SPLIT(corp_telno, '-', 3) as corp_telno3
          , FN_GET_SPLIT(corp_faxno, '-', 1) as corp_faxno1
          , FN_GET_SPLIT(corp_faxno, '-', 2) as corp_faxno2
          , FN_GET_SPLIT(corp_faxno, '-', 3) as corp_faxno3
          , FN_GET_CODENM('COM001', business_cd) AS business_cd_nm
          , FN_GET_CODENM('TAX001', corp_region_cd) AS corp_region_cd_nm
          , FN_GET_CODENM('TAX002', user_cd) AS user_cd_nm
          , FN_GET_CODENM('COM010', status_cd) AS status_cd_nm
    FROM  tcom0110a
    WHERE  user_uuid = :user_uuid
ORDER BY  business_cd, user_cd, created_at DESC
  `,

  /**
   *[회원DB] 상세 조회
   */
  SELECT_USER_LIST: `
    /* AdminUserMapper.SELECT_USER_LIST */
    SELECT  user_uuid,
            business_cd,
            user_cd,
            user_nm,
            user_birth,
            user_id,
            user_regno,
            user_hpno,
            user_email,
            corp_nm,
            corp_ceo_nm,
            corp_bnno,
            corp_cnno,
            corp_telno,
            corp_faxno,
            corp_cust_nm,
            corp_cust_hpno,
            corp_cust_email,
            corp_region_cd,
            FN_GET_CODENM('COM001', business_cd) AS business_cd_nm,
            FN_GET_CODENM('TAX001', corp_region_cd) AS corp_region_cd_nm,
            FN_GET_CODENM('TAX002', user_cd) AS user_cd_nm,
            FN_GET_CODENM('COM010', status_cd) AS status_cd_nm
      FROM  tcom0110a
      WHERE  business_cd =  :business_cd
        AND  (:user_cd = '%' or user_cd = :user_cd)
        AND  (:status_cd = '%' or status_cd = :status_cd)
        AND  (user_id like CONCAT('%', :user_id, '%'))
        AND  (user_nm like CONCAT('%', :user_nm, '%'))
  ORDER BY  business_cd, user_cd, created_at DESC
  `,

  /**
   * [회원DB] 입력
   */
  INSERT_USER: `
      /* AdminUserMapper.INSERT_USER */
      INSERT INTO tcom0110a
                  (user_uuid,
                  business_cd,
                  user_cd,
                  user_nm,
                  user_birth,
                  user_id,
                  user_pwd,
                  user_regno,
                  user_hpno,
                  user_email,
                  corp_type,
                  corp_nm,
                  corp_ceo_nm,
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
                  recv_email_yn,
                  agr1_yn,
                  agr2_yn,
                  agr3_yn,
                  agr4_yn,
                  active_yn,
                  status_cd,
                  rmk,
                  user_pwd_chg_at,
                  created_at,
                  created_ip,
                  updated_at,
                  updated_ip)
      VALUES      (Uuid_v4(),
                  :business_cd,
                  :user_cd,
                  :user_nm,
                  :user_birth,
                  :user_id,
                  :user_pwd,
                  :user_regno,
                  :user_hpno,
                  :user_email,
                  :corp_type,
                  :corp_nm,
                  :corp_ceo_nm,
                  :corp_bnno,
                  :corp_cnno,
                  :corp_telno,
                  :corp_faxno,
                  :corp_cust_nm,
                  :corp_cust_hpno,
                  :corp_cust_email,
                  :corp_post,
                  :corp_addr,
                  :corp_addr_dtl,
                  :corp_region_cd,
                  :recv_email_yn,
                  :agr1_yn,
                  :agr2_yn,
                  :agr3_yn,
                  :agr4_yn,
                  :active_yn,
                  :status_cd,
                  :rmk,
                  null,
                  Now(),
                  :created_ip,
                  Now(),
                  :updated_ip)
  `,

  /**
   * [회원DB] 입력
   */
  UPDATE_USER: `
    /* AdminUserMapper.UPDATE_USER */
    UPDATE TCOM0110A 
    SET 
      user_nm = :user_nm,
      user_birth = :user_birth,
      user_id = :user_id,
      user_regno = :user_regno,
      user_hpno = :user_hpno,
      user_email = :user_email,
      corp_type = :corp_type,
      corp_nm = :corp_nm,
      corp_ceo_nm = :corp_ceo_nm,
      corp_bnno = :corp_bnno,
      corp_cnno = :corp_cnno,
      corp_telno = :corp_telno,
      corp_faxno = :corp_faxno,
      corp_cust_nm = :corp_cust_nm,
      corp_cust_hpno = :corp_cust_hpno,
      corp_cust_email = :corp_cust_email,
      corp_post = :corp_post,
      corp_addr = :corp_addr,
      corp_addr_dtl = :corp_addr_dtl,
      corp_region_cd = :corp_region_cd,
      recv_email_yn = :recv_email_yn,
      agr1_yn = :agr1_yn,
      agr2_yn = :agr2_yn,
      agr3_yn = :agr3_yn,
      agr4_yn = :agr4_yn,
      active_yn = :active_yn,
      status_cd = :status_cd,
      rmk = :rmk,
      login_fail_cnt = :login_fail_cnt,
      login_block_yn = :login_block_yn,
      updated_at = NOW(),
      updated_ip = :updated_ip
    WHERE 
      user_uuid = :user_uuid
  `,

  /**
   * [회원DB] 입력
   */
  UPDATE_USER_LOGIN_BLOCK_RESET: `
      /* AdminUserMapper.UPDATE_USER_LOGIN_BLOCK_RESET */
      UPDATE tcom0110a SET login_fail_cnt = 0, login_block_yn = 'N'  WHERE user_uuid = :user_uuid
  `,

  /**
   * [회원DB] 입력
   */
  UPDATE_USER_PASSWORD: `
      /* AdminUserMapper.UPDATE_USER_PASSWORD */
      UPDATE tcom0110a SET user_pwd = :user_pwd  WHERE user_uuid = :user_uuid
  `,
  /**
   * [회원DB] 입력
   */
  DELETE_USER: `
      /* AdminUserMapper.DELETE_USER */
      DELETE FROM tcom0110a WHERE user_uuid = :user_uuid
  `,

  /**
   *[전문인명단DB] 상세
   */
  SELECT_USER_REG_NO_LIST: `
    /* AdminUserMapper.SELECT_USER_REG_NO_LIST */
    SELECT  business_cd,
            nm,
            reg_no,
            birth,
            created_at,
            FN_GET_CODENM('COM001', business_cd) AS business_cd_nm
      FROM  tcom0111a
      WHERE  business_cd =  :business_cd
        AND  (nm like CONCAT('%', :nm, '%'))
        AND  (reg_no like CONCAT('%', :reg_no, '%'))
  ORDER BY  created_at desc
  `,

  /**
   * [전문인명단DB] 입력
   */
  INSERT_USER_REG_NO: `
      /* AdminUserMapper.INSERT_USER_REG_NO */
      INSERT INTO tcom0111a
                  (business_cd,
                  nm,
                  reg_no,
                  birth,
                  created_at,
                  created_ip,
                  updated_at,
                  updated_ip)
      VALUES      (:business_cd,
                  :nm,
                  :reg_no,
                  :birth,
                  Now(),
                  :created_ip,
                  Now(),
                  :updated_ip)
  `,

  /**
   * [전문인명단DB] 삭제
   */
  DELETE_USER_REG_NO: `
      /* AdminUserMapper.DELETE_USER_REG_NO */
      DELETE FROM tcom0111a WHERE business_cd = :business_cd and nm = :nm and reg_no = :reg_no
  `
});
