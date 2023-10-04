const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');

module.exports = {
  test: async function (params) {
    const query = 'select business_cd, reg_no, nm, birth FROM TCOM0111A where business_cd = ?';

    const [rows] = await db.query(query, params.business_cd);
    logger.debug(rows);
    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }

    return Object.setPrototypeOf(rows, []);
  },
  select: async function (params) {
    const query = 'select business_cd, reg_no, nm FROM TCOM0111A where business_cd = ? and reg_no = ?';
    const queryParams = [params.business_cd, params.reg_no];
    const [rows] = await db.query(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.validateEmail);
    }

    return Object.setPrototypeOf(rows, []);
  },

  isVerifyUserRegNo: async function (params) {
    const query = 'select * FROM TCOM0111A where business_cd = ? and reg_no = ? and nm = ?';
    const queryParams = [params.business_cd, params.reg_no, params.nm];
    // const query = 'select * FROM TCOM0111A where business_cd = ? and reg_no = ? and nm = ? and birth = ?';
    // const queryParams = [params.business_cd, params.reg_no, params.nm, params.birth];
    const [rows] = await db.query(query, queryParams);

    if (rows.length >= 1) {
      return true;
    }

    return false;
  },

  selectList: async function (params) {
    const query = 'select business_cd, reg_no, nm, birth FROM TCOM0111A where business_cd = ?';
    const queryParams = [];
    const [rows] = await db.query(query, queryParams);

    return Object.setPrototypeOf(rows, []);
  },
  insert: async function (params) {
    const query =
      'INSERT INTO TCOM0111A(business_cd, reg_no, nm, birth, created_at, created_id, created_ip) VALUES(?, ?, ?, ?, ?, now(), ?, ?)';
    const queryParams = [params.business_cd, params.reg_no, params.nm, params.birth, null, null];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  },
  update: async function (params) {
    const query = 'UPDATE TCOM0111A SET nm=?, birth=?, updated_at = now() WHERE business_cd = ? and reg_no = ?';
    const queryParams = [params.nm, params.birth, params.business_cd, params.reg_no];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  },
  delete: async function (params) {
    const query = 'DELETE FROM TCOM0111A WHERE business_cd = ? and reg_no = ?';
    const queryParams = [params.business_cd, params.reg_no];
    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.notiInsert);
    }
    return true;
  }
};
