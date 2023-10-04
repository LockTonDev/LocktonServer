const logger = require('../config/winston');
const { NotFound } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');

module.exports = {
  select: async function (params) {
    const query = 'SELECT * FROM TCOM0020A where t_id = ?';
    const { t_id } = params;
    const [rows] = await db.query(query, [t_id]);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rows, []);
  },

  selectList: async function (params) {
    const query = 'SELECT * FROM TCOM0020A where business_cd = ? and send_type = ?';
    const { business_cd, send_type } = params;
    const [rows] = await db.query(query, [business_cd, send_type]);
    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return rows[0];
  },

  insert: async function (params) {
    const { t_id, business_cd, send_type, subject, contents, rmk } = params;
    const query = `INSERT INTO template (t_id, business_cd, send_type, subject, contents, rmk, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    const result = await db.query(query, [t_id, business_cd, send_type, subject, contents, rmk]);
    return result.affectedRows === 1;
  },

  update: async function (params) {
    const { t_id, business_cd, send_type, subject, contents, rmk } = template;
    const query = `UPDATE template SET business_cd = ?, send_type = ?, subject = ?, contents = ?, rmk = ?, updated_at = NOW()
                   WHERE t_id = ?`;
    const result = await db.query(query, [business_cd, send_type, subject, contents, rmk, t_id]);
    if (result.affectedRows < 1) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return result.affectedRows === 1;
  },

  delete: async function (params) {
    const query = 'DELETE FROM TCOM0020A WHERE t_id = ?';
    const result = await db.query(query, params);
    if (result.affectedRows < 1) {
      throw new NotFound(StatusMessage.DELETE_FAILED);
    }
    return result.affectedRows === 1;
  }
};
