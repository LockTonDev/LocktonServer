module.exports = Object.freeze({
  /**
   * [게시판DB] 상세 조회
   *
   */
  SELECT_BOARD_INFO: `
    SELECT 
        business_cd, 
        board_id, 
        board_no, 
        title, 
        content, 
        notice_yn, 
        popup_yn, 
        attach_no, 
        DATE_FORMAT(created_at, '%Y-%m-%d') AS reg_dt
    FROM TCOM0050A 
    WHERE business_cd = :business_cd 
        AND board_id = :board_id 
        AND board_no = :board_no
    ORDER BY notice_yn, board_no DESC
  `,

  /**
   *[게시판DB] 목록 조회
   */
  SELECT_BOARD_LIST: `
    SELECT 
        business_cd, 
        board_id, 
        board_no, 
        title, 
        content,
        notice_yn, 
        popup_yn, 
        attach_no, 
        DATE_FORMAT(created_at, '%Y-%m-%d') AS reg_dt
    FROM TCOM0050A 
    WHERE business_cd = :business_cd 
        AND board_id = :board_id
     ORDER BY notice_yn DESC, board_no DESC
  `,

  /**
   *[게시판DB] 입력 조회
   */
  INSERT_BOARD: `
    INSERT INTO TCOM0050A 
    (
        business_cd, 
        board_id, 
        board_no, 
        title, 
        content, 
        del_yn, 
        notice_yn, 
        popup_yn, 
        attach_no, 
        created_at,
        created_id, 
        created_ip
    ) 
    VALUES 
    (
        :business_cd, 
        :board_id, 
        (SELECT * FROM (SELECT IFNULL(MAX(board_no), 0) + 1 FROM TCOM0050A WHERE business_cd = :business_cd AND board_id = :board_id ) AS board_no),
        :title, 
        :content, 
        :del_yn, 
        :notice_yn, 
        :popup_yn, 
        :attach_no, 
        now(), 
        :created_id, 
        :created_ip 
    )
  `,

  /**
   *[게시판DB] 입력 조회
   */
  UPDATE_BOARD: `
    UPDATE TCOM0050A 
    SET
        board_id = :board_id,
        title = :title,
        content = :content,
        del_yn = :del_yn,
        notice_yn = :notice_yn,
        popup_yn = :popup_yn,
        attach_no = :attach_no,
        update_at = now(),
        update_id = :update_id,
        update_ip = :update_ip
    WHERE business_cd = :business_cd 
        AND board_id = :board_id
        AND board_no = :board_no;
  `,
  /**
   *[게시판DB] 입력 조회
   */
  DELETE_BOARD: `
    DELETE FROM TCOM0050A 
    WHERE business_cd = :business_cd 
         AND board_id = :board_id
         AND board_no = :board_no;
  `
});
