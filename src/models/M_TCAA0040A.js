const logger = require('../config/winston');
const db = require('../config/db');
const { NotFound } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');

module.exports = {
  select: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.params;

    const query = `SELECT b.*,
                          a.*,
                          FN_GET_CODENM('COM040', a.apply_cd) AS apply_nm,
                          FN_GET_CODENM('COM041', a.proc_cd) AS proc_nm
                      FROM   TCAA0040A a,
                          (SELECT insurance_uuid,
                                  user_uuid,
                                  user_nm   AS insurance_user_nm,
                                  insr_year AS insurance_year
                          FROM   TCAA0030A
                          WHERE  user_uuid = ?
                          ORDER  BY created_at DESC
                          LIMIT  1) AS b
                      WHERE  a.user_uuid = ? 
                          and a.apply_no = ?
                          AND a.user_uuid = b.user_uuid
                      ORDER  BY a.apply_no DESC; `;
    const [rows] = await db.query(query, [user_uuid, user_uuid, params.apply_no]);

    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }

    return rows[0];
  },

  selectList: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body;

    const page = parseInt(params.page || 1, 10);
    const limit = parseInt(params.limit || 10, 10);
    const offset = (page - 1) * limit;

    // const query = 'SELECT * FROM TCAA0040A WHERE user_id = ? ORDER BY apply_no DESC';
    let query = `SELECT a.*,
                        FN_GET_CODENM('COM040', a.apply_cd) AS apply_nm,
                        FN_GET_CODENM('COM041', a.proc_cd) AS proc_nm
                    FROM   TCAA0040A a
                    WHERE  a.user_uuid = ?`;
    let conditions = [user_uuid];

    // 검색조건 추가
    // if (params.start_date) {
    //   query += ' AND created_at >= ?';
    //   conditions.push(params.start_date);
    // }

    // if (params.end_date) {
    //   query += ' AND created_at <= ?';
    //   conditions.push(params.end_date);
    // }

    query += ' ORDER BY a.apply_no DESC LIMIT ?, ?';
    conditions.push(offset, limit);

    const [rows] = await db.query(query, conditions);

    return rows;
  },

  selectCount: async function (req) {
    const user_uuid = req.decoded.uuid;

    let query = 'SELECT COUNT(*) AS count FROM TCAA0040A WHERE user_uuid = ? ';

    let conditions = [user_uuid];

    // 검색조건 추가
    // if (params.start_date) {
    //   query += ' AND created_at >= ?';
    //   conditions.push(params.start_date);
    // }

    // if (params.end_date) {
    //   query += ' AND created_at <= ?';
    //   conditions.push(params.end_date);
    // }

    const [rows] = await db.query(query, conditions);

    return rows[0].count;
  },

  insert: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const query = `INSERT INTO TCAA0040A (user_cd, business_cd, insurance_no, insurance_user_nm, email,
                                          tel, nm, apply_cd, apply_content, apply_posted_dt,
                                          apply_dt, proc_cd, insurance_uuid, user_uuid, created_ip, updated_ip) 
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const queryParams = [
      params.user_cd,
      params.business_cd,
      params.insurance_no,
      params.insurance_user_nm,
      params.email,
      params.tel,
      params.nm,
      params.apply_cd,
      params.apply_content,
      params.apply_posted_dt,
      params.apply_dt,
      params.proc_cd,
      params.insurance_uuid,
      user_uuid,
      params.created_ip,
      params.updated_ip
    ];
    logger.debug(queryParams);

    const [rows] = await db.queryWithTransaction(query, queryParams);

    if (rows.affectedRows < 1) {
      throw new NotFound(StatusMessage.INSERT_FAILED);
    }
    return true;
  },

  update: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const query =
      'UPDATE TCAA0040A SET email = ?, tel = ?, nm = ?, apply_cd = ?, apply_content = ?, apply_posted_dt = ?, proc_at = ?, proc_content = ?, proc_cd = ? WHERE apply_no = ?';
    const { email, tel, nm, apply_cd, apply_content, apply_posted_dt, proc_at, proc_content, proc_cd, apply_no } =
      params;
    const [result] = await db.query(query, [
      email,
      tel,
      nm,
      apply_cd,
      apply_content,
      apply_posted_dt,
      proc_at,
      proc_content,
      proc_cd,
      apply_no
    ]);

    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }

    return true;
  },

  delete: async function (req) {
    const user_uuid = req.decoded.uuid;
    const params = req.body.params;

    const query = 'DELETE FROM TCAA0040A WHERE apply_no = ?';
    const [result] = await db.query(query, params.apply_no);

    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }

    return true;
  }
};
