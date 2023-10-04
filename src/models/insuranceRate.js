const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const logger = require('../config/winston');

/**
 * 보험료표
 *
 * TABLE : TCOM0030A
 *
 */
module.exports = {
  select: async function (params) {
    const query =
      'select base_year, ver, user_cd, business_cd, insr_st_dt, insr_cncls_dt, days, insurance_nm, contents, insurance_no from TCOM0030A where user_cd = ?, business_cd = ?, base_year = ? and ver = ?';
    const [rows] = await db.query(query, params.user_cd, params.business_cd, params.base_year, params.ver);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.validateEmail);
    }

    return Object.setPrototypeOf(rows, []);
  },

  selectTop: async function (params) {
    const query = `select base_year, ver, user_cd, business_cd, insr_st_dt, insr_cncls_dt, days, insurance_nm, contents, insurance_no 
        from TCOM0030A 
        where user_cd = ? and business_cd = ? and use_yn = 'Y' 
        order by base_year desc, ver desc limit 1`;
    const queryParams = [params.user_cd, params.business_cd];
    const [rows] = await db.query(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.validateEmail);
    }

    return Object.setPrototypeOf(rows, []);
  },

  selectList: async function (params) {
    const query =
      'select base_year, ver, user_cd, business_cd, insr_st_dt, insr_cncls_dt, insurance_nm, contents, insurance_no from TCOM0030A where business_cd = ?';
    const [rows] = await db.query(query, params.business_cd);

    return Object.setPrototypeOf(rows, []);
  },
  insert: async function (params) {
    const query =
      'INSERT INTO TCOM0030A (base_year, ver, user_cd, business_cd, insr_st_dt, insr_cncls_dt, insurance_nm, contents, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, sysdate(), sysdate());';
    const queryParams = [params.base_year, params.ver, params.business_cd, params.insurance_nm, params.contents];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  },
  update: async function (params) {
    const query =
      'UPDATE TCOM0030A SET user_cd=?, business_cd=?, insurance_nm=?, contents=?, mod_dt=sydate() WHERE base_year=? AND ver=?';
    const queryParams = [
      params.user_cd,
      params.business_cd,
      params.insurance_nm,
      params.contents,
      params.base_year,
      params.ver
    ];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  },
  delete: async function (params) {
    const query = 'DELETE FROM TCOM0030A WHERE base_year=? AND ver=?';
    const paqueryParamsrams = [params.base_year, params.ver];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  }
};
