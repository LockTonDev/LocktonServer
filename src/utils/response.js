const StatusCode = {
  OK: 200,
  CREATED: 201,
  NOCONTENT: 204,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
  CONFLICT: 409,
  TOOMANYREQUEST: 429
};

const StatusMessage = {
  /* 기본 메세지*/
  UNDEFINED_FAILED: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
  PASSWORD_CNT_FAILED: '5회 이상 로그인 실패로 인하여 아이디가 잠겼습니다. 관리자에게 문의하세요.',
  SELECT_OK: '조회 성공',
  INSERT_OK: '입력 성공',
  UPDATE_OK: '수정 성공',
  DELETE_OK: '삭제 성공',

  SELECT_FAILED: '조회 실패',
  INSERT_FAILED: '입력 실패',
  UPDATE_FAILED: '수정 실패',
  DELETE_FAILED: '삭제 실패',

  /* 인증 메세지 */
  VERITY_OK: '인증 성공',
  VERITY_FAILED: '인증 실패',

  VERITY_USERPWD_FAILED: '비밀번호를 다시 확인하세요.',

  DUPLICATION_FAILED: 'DUPLICATION_FAILED',
  DUPLICATION_FAILED: 'DUPLICATION_FAILED',

  /* 사용자 탈퇴 */
  RESIGNATION_OK: '회원 탈퇴에 성공하였습니다.',
  RESIGNATION_FAILED: '회원 탈퇴에 실패하였습니다. 관리자에게 문의하세요.',

  /* 사용자*/
  VERITY_USERID_OK: '사용 가능한 아이디 입니다.',
  VERITY_USERID_FAILED: '사용 할 수 없는 아이디 입니다.',

  VERITY_USERPWD_OK: '비밀번호가 확인되었습니다.',
  VERITY_USERPWD_FAILED: '비밀번호를 다시 확인하세요.',

  VERITY_EMAIL_OK: '사용 가능한 이메일 입니다.',
  VERITY_EMAIL_FAILED: '사용 할 수 없는 이메일 입니다.',

  VerityUserCustoms_FAILED: '인증실패 : 이름, 생년월일, 등록번호를 확인하세요.',

  /* 미사용 - 사용자*/
  userNotFound: '사용자 정보 없음',
  userInfoUpdateNotFound: '수정된 사용자 정보 없음',
  userActiveUpdateNotFound: '사용자 비활성화 실패',
  userDelete: '삭제된 사용자 없음',
  userPushStateUpdateNotFound: '수정된 사용자 푸쉬 알림 여부 없음',
  userPasswordUpdateNotFound: '수정된 사용자 비밀번호 없음',

  unActiveUser: '탈퇴 처리된 유저',
  validateEmail: '이미 존재하는 이메일 주소',
  unValidateUser: '존재하지 않는 유저',
  checkIDPasswordAgain: '이메일 주소 혹은 비밀번호를 다시 확인',
  unValidateToken: '유효하지 않음',
  requestTokenAgain: '허용되지 않은 접근 입니다.',
  sendMailFailed: '새 비밀번호 지정을 위한 메일 전송 실패',
  unValidateVerificationCode: '유효하지 않은 인증번호.',
  limitedAdmin : '관리자에 문의에 해주세요.',

  /* 공통*/
  BadRequestMeg: '잘못된 요청',
  ApiUrlIsInvalid: '잘못된 경로',
  RequestWithIntentionalInvalidUrl: '의도적인 잘못된 경로 요청',
  TooManyRequest: 'Too many accounts created from this IP'
};

module.exports = { StatusCode, StatusMessage };
