module.exports = Object.freeze({
  /**
   * [회원DB] 비밀번호 변경
   */
  UPDATE_USER_PASSWORD: `
    /* UserMapper.UPDATE_USER_PASSWORD */  
    UPDATE TCOM0110A SET user_pwd = :user_pwd, updated_at = now() WHERE user_uuid = :user_uuid
  `,

  /**
   * [회원DB]
   *
   * - :user_uuid 사용자 KEY
   */
  SELECT_USER_EMAIL_COR: `
      /* UserMapper.SELECT_USER_EMAIL_COR */  
      SELECT user_email
      FROM   tcom0110a
      WHERE  user_id = :user_id
            AND user_nm = :user_nm
            AND corp_bnno = :corp_bnno
  `,

  /**
   * [회원DB]
   *
   * - :user_uuid 사용자 KEY
   */
  SELECT_USER_EMAIL_JNT: `
      /* UserMapper.SELECT_USER_EMAIL_JNT */  
      SELECT user_email
      FROM   tcom0110a
      WHERE  user_id = :user_id
            AND user_nm = :user_nm
  `,

  SELECT_USER_HP_AUTH_USER_UUID_IND: `
      /* UserMapper.SELECT_USER_HP_AUTH_USER_UUID_IND */  
      SELECT user_uuid
      FROM tcom0110a
      WHERE user_id = :user_id
            AND user_nm = :user_nm
            AND user_birth = :user_birth
            AND user_hpno = :user_hpno
  `,
  SELECT_USER_CD: `
      /* UserMapper.SELECT_USER_HP_AUTH_USER_UUID_IND */  
      SELECT user_cd
      FROM tcom0110a
      WHERE user_id = :user_id
            AND business_cd = :business_cd
  `,
  SELECT_EMAIL_AUTH: `
      /* UserMapper.SELECT_EMAIL_AUTH */  
      SELECT (SELECT user_uuid from tcom0110a where user_id = :user_id and business_cd = :business_cd) as user_uuid
      FROM email_auth
      WHERE user_id = :user_id
            AND auth_code = :auth_code
            AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 5
      ORDER BY created_at DESC
      LIMIT 1;
  `,
  INSERT_EMAIL_AUTH: `
      /* UserMapper.INSERT_EMAIL_AUTH */  
      INSERT INTO email_auth
                  (user_email,
                  auth_code,
                  created_at,
                  user_id,
                  user_nm)
      VALUES      (:user_email,
                  :auth_code,
                  NOW(),
                  :user_id,
                  :user_nm
                  ) 
  `
});
