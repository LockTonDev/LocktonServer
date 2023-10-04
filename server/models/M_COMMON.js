const db = require('../config/db');
const logger = require('../config/winston');
const { NotFound } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');

/**
 * 공통_공통코드 상세
 *
 * TABLE
 *  - TCOM0010A / 공통코드
 *  - TCOM0011A / 공통코드 상세
 *
 *
 */
module.exports = {
  // SelectBox 형식 코드 조회
  async getCode(params) {
    logger.debug(params);
    const query = `SELECT dtl_nm as title, dtl_cd as value, description as rmk FROM TCOM0011A WHERE grp_cd = ? AND del_yn = 'N' and use_yn = 'Y' order by seq asc`;
    const [rows] = await db.query(query, params.grp_cd);
    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }
    return rows;
  },

  // 모든 상세 코드 가져오기
  async getCodeALL(params) {
    const query = `SELECT grp_cd, dtl_cd as value, dtl_nm as title, description as rmk FROM TCOM0011A`;

    const [rows] = await db.query(query, null);

    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }
    return rows;
  },

  // 특정 상세 코드 가져오기
  async getDetail(grpCd, dtlCd) {
    const query = `SELECT * FROM TCOM0011A WHERE grp_cd = ? AND dtl_cd = ? AND del_yn = 'N'`;

    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      throw new NotFound(StatusMessage.NOT_FOUND);
    }
    return rows;
  },

  // 상세 코드 추가하기
  async addDetail(params) {
    const [result] = await db.queryWithTransaction(
      'INSERT INTO TCOM0011A (grp_cd, dtl_cd, dtl_nm, use_yn, description) VALUES (?, ?, ?, ?, ?)',
      [params]
    );
    return result.insertId;
  },

  // 상세 코드 수정하기
  async updateDetail(grpCd, dtlCd, dtlNm, useYn = 'Y', description = '') {
    const [result] = await pool.execute(
      'UPDATE TCOM0011A SET dtl_nm = ?, use_yn = ?, description = ?, updated_at = NOW() WHERE grp_cd = ? AND dtl_cd = ?',
      [dtlNm, useYn, description, grpCd, dtlCd]
    );
    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.UPDATE_FAILED);
    }
    return result.affectedRows;
  },

  // 상세 코드 삭제하기
  async deleteDetail(grpCd, dtlCd) {
    const [result] = await pool.execute(
      "UPDATE TCOM0011A SET del_yn = 'Y', updated_at = NOW() WHERE grp_cd = ? AND dtl_cd = ?",
      [grpCd, dtlCd]
    );
    if (result.affectedRows === 0) {
      throw new NotFound(StatusMessage.DELETE_FAILED);
    }
    return result.affectedRows;
  }
};
