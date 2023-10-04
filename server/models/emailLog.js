const logger = require('../config/winston');
const db = require('../config/db');
const { NotFound } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');

module.exports = {
  select: async function (params) {
    const query = 'SELECT * FROM email_log WHERE reg_no = ?';
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return rows[0];
  },

  selectList: async function (params) {
    const query = 'SELECT * FROM email_log WHERE business_cd = ? sent_at between ? and ? order by reg_no desc';
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return rows[0];
  },

  insert: async function (business_cd, mail_id, subject, body, sent_at, success, error_message, user_id) {
    const query =
      'INSERT INTO email_log (business_cd, mail_id, subject, body, sent_at, success, error_message, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [
      business_cd,
      mail_id,
      subject,
      body,
      sent_at,
      success,
      error_message,
      user_id
    ]);

    return result.insertId;
  },

  delete: async function (reg_no) {
    const query = 'DELETE FROM email_log WHERE reg_no = ?';
    const [result] = await db.query(query, reg_no);

    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }

    return true;
  }
};
