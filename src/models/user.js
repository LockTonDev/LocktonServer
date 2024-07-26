const logger = require('../config/winston');
const bcrypt = require('bcryptjs');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const { genAuthCode } = require('../utils/util');
const db = require('../config/db');
const knexDB = require('../config/knexDB');

const M_TTAX0030A = require('./M_TTAX0030A');
const UserMapper = require('../mapper/UserMapper');

module.exports = {
  /**
   * 로그인 사용자 조회
   * @param {*} userInfo
   * @returns
   */
  signIn: async function (business_cd, user_cd, user_id, user_pwd) {
    let sqlSelect = ''
    let params = ''
    if(business_cd == 'ADM'){
      sqlSelect = `SELECT business_cd, user_uuid, user_id, user_pwd, user_nm, user_cd, user_birth, user_regno, corp_cnno, status_cd, login_fail_cnt, login_block_yn FROM TCOM0110A WHERE business_cd = ? and user_id = ? and (status_cd not in ('90') || status_cd is null)`;
      params = [business_cd, user_id]
    }else{
      sqlSelect = `SELECT business_cd, user_uuid, user_id, user_pwd, user_nm, user_cd, user_birth, user_regno, corp_cnno, status_cd, login_fail_cnt, login_block_yn FROM TCOM0110A WHERE business_cd = ? and user_cd = ? and user_id = ? and (status_cd not in ('90') || status_cd is null)`;
      params = [business_cd, user_cd, user_id]
    }

    const [rows] = await db.query(sqlSelect, params);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.unValidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },

  /**
   * 로그인 사용자 조회
   * @param {*} userInfo
   * @returns
   */
  updateLoginCnt: async function (business_cd, user_cd, user_id) {
    const sqlSelect = `UPDATE TCOM0110A SET login_fail_cnt = login_fail_cnt + 1
                                            , login_block_yn = CASE WHEN login_fail_cnt >= 5 THEN 'Y' ELSE 'N' END
                         WHERE business_cd = ? and user_cd = ? and user_id = ? and (status_cd not in ('90') || status_cd is null)`;
    const [rows] = await db.query(sqlSelect, [business_cd, user_cd, user_id]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.unValidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },
  /**
   * 로그인 사용자 조회
   * @param {*} userInfo
   * @returns
   */
  updateLoginCntZero: async function (business_cd, user_cd, user_id) {
    const sqlSelect = `UPDATE TCOM0110A SET login_fail_cnt = 0
                                            , login_block_yn = 'N'
                         WHERE business_cd = ? and user_cd = ? and user_id = ? and (status_cd not in ('90') || status_cd is null)`;
    const [rows] = await db.query(sqlSelect, [business_cd, user_cd, user_id]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.unValidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },

  /**
   * 로그인 사용자 조회
   * @param {*} userInfo
   * @returns
   */
  setLoginCntInit: async function (business_cd, user_cd, user_id, user_pwd) {
    const sqlSelect = `UPDATE TCOM0110A SET login_fail_cnt = 0
                                            , login_block_yn = 'N'
                         WHERE business_cd = ? and user_cd = ? and user_id = ? and (status_cd not in ('90') || status_cd is null)`;
    const [rows] = await db.query(sqlSelect, [business_cd, user_cd, user_id]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.unValidateUser);
    }

    return Object.setPrototypeOf(rows, []);
  },

  select: async function (req) {
    const userUUID = req.decoded.uuid;

    const query = `SELECT user_uuid, business_cd, user_cd, user_nm, user_birth, user_id, user_regno, user_hpno, user_email
                              , corp_type, corp_nm, corp_ceo_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno, corp_cust_nm
                              , corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd
                              , status_cd
                              , recv_email_yn
                              , agr1_yn
                              , agr2_yn
                              , agr3_yn
                              , agr4_yn
                              , active_yn
                              , FN_GET_SPLIT(corp_telno, '-', 1) as corp_telno1
                              , FN_GET_SPLIT(corp_telno, '-', 2) as corp_telno2
                              , FN_GET_SPLIT(corp_telno, '-', 3) as corp_telno3
                              , FN_GET_SPLIT(corp_faxno, '-', 1) as corp_faxno1
                              , FN_GET_SPLIT(corp_faxno, '-', 2) as corp_faxno2
                              , FN_GET_SPLIT(corp_faxno, '-', 3) as corp_faxno3
                              , FN_GET_CODENM('TAX001', corp_region_cd) as corp_region_nm
                              , created_at
                              FROM TCOM0110A WHERE user_uuid = ?`;
    const [rows] = await db.query(query, userUUID);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(rows, []);
  },

  insert: async function (params) {
    const hash_password = bcrypt.hashSync(params.user_pwd, 10);
    logger.debug(params);
    const query = `INSERT INTO TCOM0110A 
    (user_uuid, business_cd, user_cd, user_nm, user_birth, user_id, user_pwd, user_regno, user_hpno, user_email
    ,corp_type, corp_nm, corp_ceo_nm, corp_bnno, corp_cnno, corp_telno, corp_faxno, corp_cust_nm
    ,corp_cust_hpno, corp_cust_email, corp_post, corp_addr, corp_addr_dtl, corp_region_cd
    ,recv_email_yn, agr1_yn, agr2_yn, agr3_yn, agr4_yn, active_yn, status_cd, rmk,  user_pwd_chg_at, created_at, created_ip, updated_at, updated_ip) 
     VALUES(UUID_V4(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), ?, now(), ?)`;

    const queryParams = [
      params.business_cd,
      params.user_cd,
      params.user_nm,
      params.user_birth,
      params.user_id,
      hash_password,
      params.user_regno,
      params.user_hpno,
      params.user_email,
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
      params.recv_email_yn,
      params.agr1_yn,
      params.agr2_yn,
      params.agr3_yn,
      params.agr4_yn,
      params.active_yn,
      params.status_cd,
      params.rmk,
      params.created_ip,
      params.updated_ip
    ];

    const [rows] = await db.query(query, queryParams);
    //const [rows] = await db.queryWithTransaction(query, queryParams);
    logger.debug(rows);
    //console.log("!!!")
    //const resultUser = await user.updateFromInsurance(req);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }

    return true;
  },

  update: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;
    const hash_password = bcrypt.hashSync(params.user_pwd, 10);

    const query = `UPDATE TCOM0110A SET user_pwd=?, user_hpno=?, user_email=?, corp_type=?, corp_nm=?, corp_ceo_nm=?, corp_bnno=?, corp_cnno=?, corp_telno=?, corp_faxno=?
                  , corp_cust_nm=?, corp_cust_hpno=?, corp_cust_email=?, corp_post=?, corp_addr=?, corp_addr_dtl=?, corp_region_cd=?
                  , recv_email_yn=?, agr1_yn=?, agr2_yn=?, agr3_yn=?, agr4_yn=?, active_yn=?
                  , status_cd=?, rmk=?, updated_at=now(), updated_ip=?
                  WHERE user_uuid=?`;

    const queryParams = [
      hash_password,
      params.user_hpno,
      params.user_email,
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
      params.recv_email_yn,
      params.agr1_yn,
      params.agr2_yn,
      params.agr3_yn,
      params.agr4_yn,
      params.active_yn,
      params.status_cd,
      params.rmk,
      params.updated_ip,
      user_uuid
    ];

    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }

    return true;
  },

  /**
   * 보험정보 업데이트
   * @param {} req
   * @returns
   */
  updateFromInsurance: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const query = `UPDATE TCOM0110A SET user_nm=?, corp_type=?, corp_nm=?, corp_ceo_nm=?, corp_bnno=?, corp_cnno=?, corp_telno=?, corp_faxno=?
                  , corp_cust_nm=?, corp_post=?, corp_addr=?, corp_addr_dtl=?, corp_region_cd=?
                  , updated_at=now(), updated_ip=?
                  WHERE user_uuid=?`;

    const queryParams = [
      params.user_nm,
      params.corp_type,
      params.corp_nm,
      params.corp_ceo_nm,
      params.corp_bnno,
      params.corp_cnno,
      params.corp_telno1 + '-' + params.corp_telno2 + '-' + params.corp_telno3,
      params.corp_faxno1 + '-' + params.corp_faxno2 + '-' + params.corp_faxno3,
      params.corp_cust_nm,
      params.corp_post,
      params.corp_addr,
      params.corp_addr_dtl,
      params.corp_region_cd,
      params.updated_ip,
      params.user_uuid
    ];

    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }

    return true;
  },

  delete: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const sqlDelete = 'DELETE FROM TCOM0110A WHERE user_uuid = ?';

    const [rows] = await db.queryWithTransaction(sqlDelete, [user_uuid]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.userDelete);
    }

    return true;
  },

  resignation: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const sqlDelete = `UPDATE TCOM0110A SET status_cd = '90' WHERE user_uuid = ?`;

    const [rows] = await db.queryWithTransaction(sqlDelete, [user_uuid]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.userDelete);
    }

    return true;
  },

  updatePassword: async function (req) {
    const user_uuid = req.decoded.uuid;

    const hash_password = bcrypt.hashSync(req.body.params.new_user_pwd, 10);
    logger.debug(user_uuid, hash_password);

    const params = { user_pwd: hash_password, user_uuid: user_uuid };
    const resultData = await knexDB.raw(UserMapper.UPDATE_USER_PASSWORD, params);
    logger.debug(resultData);

    if (resultData[0].length < 1) {
      throw new NotFound(StatusMessage.userPasswordUpdateNotFound);
    }

    return true;
  },
  updatePasswordNotLogin: async function (req) {
    const { params } = req.body;
    logger.debug(params);
    const hash_password = bcrypt.hashSync(params.new_user_pwd, 10);
    params.user_pwd = hash_password;

    const resultData = await knexDB.raw(UserMapper.UPDATE_USER_PASSWORD, params);
    logger.debug(resultData);

    if (resultData.affectedRows < 1) {
      throw new NotFound(StatusMessage.userPasswordUpdateNotFound);
    }

    return true;
  },

  isVerifyUser: async function (params) {
    const query =
      'select user_id FROM TCOM0110A where business_cd = ? and user_cd = ? and user_nm = ? and user_hpno = ? and user_birth = ?';
    const queryParams = [params.business_cd, params.user_cd, params.user_nm, params.user_hpno, params.user_birth];
    logger.debug(queryParams);
    const [rows] = await db.query(query, queryParams);

    if (rows.length == 0) {
      return null;
    }
    return rows;
  },

  isVerifyUserForRegNo: async function (params) {
    const query =
      'select user_id FROM TCOM0110A where business_cd = ? and user_nm = ? and user_birth = ? and user_regno = ?';
    const queryParams = [params.business_cd, params.nm, params.birth, params.reg_no];
    logger.debug(queryParams);
    const [rows] = await db.query(query, queryParams);

    if (rows.length == 0) {
      return true;
    }
    return false;
  },

  isVerifyUserId: async function (params) {
    const query = 'select user_id FROM TCOM0110A where business_cd = ? and user_cd = ? and user_id = ?';
    const queryParams = [params.business_cd, params.user_cd, params.user_id];
    logger.debug(queryParams);
    const [rows] = await db.query(query, queryParams);

    if (rows.length != 0) {
      return false;
    }
    return true;
  },

  isVerifyPassword: async function (req) {
    const userUUID = req.decoded.uuid;
    const user_id = req.body.params.user_id;
    const user_pwd = req.body.params.user_pwd;
    const query = 'SELECT user_pwd FROM TCOM0110A WHERE user_uuid = ? and user_id = ?';
    const queryParmas = [userUUID, user_id];

    const [rows] = await db.query(query, [userUUID, user_id]);

    const isAuth = bcrypt.compareSync(user_pwd, rows[0].user_pwd);

    if (!isAuth) return false;

    return true;
  },

  isVerifyUserEMail: async function (req) {
    const user_uuid = req?.decoded?.uuid;
    const params = req.body.params;

    let query = 'SELECT user_email FROM TCOM0110A WHERE  business_cd = ? and user_cd = ? and user_email = ? ';
    const queryParams = [params.business_cd, params.user_cd, params.user_email];

    if (typeof user_uuid !== 'undefined') {
      query += ' and user_uuid != ?';
      queryParams.push(user_uuid);
    }

    const [rows] = await db.query(query, queryParams);

    if (rows.length != 0) {
      return false;
    }
    return true;
  },

  isVerifyEMailAuthCode: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.SELECT_EMAIL_AUTH, params);
    logger.debug(resultData[0]);
    if (resultData[0].length > 0) {
      return resultData[0][0].user_uuid;
    }
    return null;
  },
  isVerifyUserUUID: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.SELECT_USER_HP_AUTH_USER_UUID_IND, params);
    params.user_uuid = null;
    logger.debug(resultData[0]);
    if (resultData[0].length > 0) {
      return resultData[0][0].user_uuid;
    }

    return null;
  },
  chkDupUser: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.CHECK_DUPLICATION_USER, params);
    return resultData[0];
  },
  getUserCd: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.SELECT_USER_CD, params);
    params.user_cd = null;
    logger.debug(resultData[0]);
    if (resultData[0].length > 0) {
      return resultData[0][0].user_cd;
    }

    return null;
  },
  getUserUUID: async function (params) {
    //const params = req.body.params;
    console.log(params.user_id)
    const resultData = await knexDB.raw(UserMapper.SELECT_USER_UUID, params);
    params.user_uuid = null;
    
    console.log(resultData);
    console.log(resultData[0]);
    if (resultData[0].length > 0) {
      return resultData[0][0].user_uuid;
    }

    return resultData[0].user_uuid;
  },
  isVerifyUserEMail_COR: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.SELECT_USER_EMAIL_COR, params);
    params.auth_code = null;
    params.user_email = null;

    if (resultData[0].length > 0) {
      // 인증번호 생성 후 저장
      params.auth_code = genAuthCode().authCode;
      params.user_email = resultData[0][0].user_email;
      logger.debug(params);
      await knexDB.raw(UserMapper.INSERT_EMAIL_AUTH, params);
    }

    return params;
  },
  isVerifyUserEMail_JNT: async function (req) {
    const params = req.body.params;
    const resultData = await knexDB.raw(UserMapper.SELECT_USER_EMAIL_JNT, params);
    params.auth_code = null;
    params.user_email = null;
    logger.info(resultData[0])
    if (resultData[0].length > 0) {
      // 인증번호 생성 후 저장
      params.auth_code = genAuthCode().authCode;
      params.user_email = resultData[0][0].user_email;
      logger.debug(params);
      await knexDB.raw(UserMapper.INSERT_EMAIL_AUTH, params);
    }

    return params;
  },
  updateContract0030a: async function (params,tableName) {
    //const user_uuid = req?.decoded?.uuid;
    //const params = req.body.params;

    //console.log('params.corp_cnno',params.corp_cnno)
    //console.log('params.user_regno',params.user_regno)
    let query = 'update '+tableName+' set user_uuid = ? where user_regno = ? ';
    const queryParams = [params.user_uuid, params.user_regno];

    // if (typeof user_uuid !== 'undefined') {
    //   query += ' and user_uuid != ?';
    //   queryParams.push(user_uuid);
    // }

    const [rows] = await db.query(query, queryParams);

    if (rows.length != 0) {
      return false;
    }
    return true;
  },
  updateRenewal0031a: async function (params,tableName) {
     //const user_uuid = req?.decoded?.uuid;
    //  const params = req.body.params;

     let query = 'update '+tableName+' set user_uuid = ? where user_regno = ? and business_cd = ? ';
     const queryParams = [params.user_uuid, params.user_regno, params.business_cd];
 
     // if (typeof user_uuid !== 'undefined') {
     //   query += ' and user_uuid != ?';
     //   queryParams.push(user_uuid);
     // }

    const [rows] = await db.query(query, queryParams);

    if (rows.length != 0) {
      return false;
    }
    return true;
  },
};
