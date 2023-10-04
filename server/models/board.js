const db = require('../config/db');
const { NotFound } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');

module.exports = {
  insert: async function (boardData) {
    const query =
      'INSERT INTO TCOM0050A (business_cd, board_id, title, content, del_yn, notice_yn, popup_yn, attach_no, created_id, created_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [
      boardData.business_cd,
      boardData.board_id,
      boardData.title,
      boardData.content,
      boardData.del_yn || 'N',
      boardData.notice_yn || 'N',
      boardData.popup_yn || 'N',
      boardData.attach_no || null,
      boardData.created_id || null,
      boardData.created_ip || null
    ]);

    return result.insertId;
  },

  update: async function (boardData) {
    const query =
      'UPDATE TCOM0050A SET title = ?, content = ?, del_yn = ?, notice_yn = ?, popup_yn = ?, attach_no = ?, update_id = ?, update_ip = ?, update_at = now() WHERE board_id = ?';
    const [result] = await db.query(query, [
      boardData.title,
      boardData.content,
      boardData.del_yn || 'N',
      boardData.notice_yn || 'N',
      boardData.popup_yn || 'N',
      boardData.attach_no || null,
      boardData.update_id || null,
      boardData.update_ip || null,
      boardData.board_id
    ]);

    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return true;
  },

  delete: async function (boardId) {
    const query = 'DELETE FROM TCOM0050A WHERE board_id = ?';
    const [result] = await db.query(query, boardId);

    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return true;
  },

  select: async function (params) {
    const query =
      'SELECT business_cd, board_id, board_no, title, content, DATE_FORMAT(created_at, "%Y-%m-%d") as created_at FROM TCOM0050A WHERE business_cd = ? AND board_id = ? and board_no = ?';
    const [rows] = await db.query(query, [params.business_cd, params.board_id, params.board_no]);

    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return rows[0];
  },

  selectPopupList: async function (params) {
    let query =
      'SELECT business_cd, board_id, board_no, title, content, DATE_FORMAT(created_at, "%Y-%m-%d") as created_at, false as open_popup  FROM TCOM0050A WHERE business_cd = ? AND board_id = "notice" AND del_yn = "N" and popup_yn = "Y"';
    let conditions = [params.business_cd];

    query += ' ORDER BY board_no DESC';
    const [rows] = await db.query(query, conditions);

    return rows;
  },

  selectList: async function (params) {
    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 10, 10);
    const offset = (page - 1) * limit;

    let query =
      'SELECT business_cd, board_id, board_no, title, content, DATE_FORMAT(created_at, "%Y-%m-%d") as created_at  FROM TCOM0050A WHERE business_cd = ? AND board_id = ? AND del_yn = "N" and popup_yn != "Y"';

    let conditions = [params.business_cd, params.board_id];

    if (params.title) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      conditions.push(`%${params.title}%`);
      conditions.push(`%${params.title}%`);
    }

    if (params.content) {
      query += ' AND content LIKE ?';
      conditions.push(`%${params.content}%`);
    }

    if (params.start_date) {
      query += ' AND created_at >= ?';
      conditions.push(params.start_date);
    }

    if (params.end_date) {
      query += ' AND created_at <= ?';
      conditions.push(params.end_date);
    }

    query += ' ORDER BY notice_yn desc, board_no DESC LIMIT ?, ?';
    conditions.push(offset, limit);

    const [rows] = await db.query(query, conditions);

    return rows;
  },

  selectCount: async function (params) {
    let query = 'SELECT COUNT(*) AS count FROM TCOM0050A WHERE business_cd = ? AND board_id = ? AND del_yn = "N"';

    let conditions = [params.business_cd, params.board_id];

    if (params.title) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      conditions.push(`%${params.title}%`);
      conditions.push(`%${params.title}%`);
    }

    if (params.content) {
      query += ' AND content LIKE ?';
      conditions.push(`%${params.content}%`);
    }

    if (params.start_date) {
      query += ' AND created_at >= ?';
      conditions.push(params.start_date);
    }

    if (params.end_date) {
      query += ' AND created_at <= ?';
      conditions.push(params.end_date);
    }

    const [rows] = await db.query(query, conditions);

    return rows[0].count;
  }
};
