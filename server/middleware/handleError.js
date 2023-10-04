const logger = require('../config/winston');
const { GeneralError } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');

const handleErrors = (err, req, res, next) => {
  const errInfo = { errCode: null, bSuccess: false, message: '' };
  logger.error('>> ', err.message);
  // custom application error
  if (typeof err === 'string') {
    errInfo.errCode = 400;
    errInfo.message = err;
  }
  // JWT 인증오류
  else if (err.name === 'UnauthorizedError') {
    errInfo.errCode = 401;
    errInfo.message = '허용되지 않은 접근입니다.';

    // 서버오류
  } else {
    errInfo.errCode = 500;
    //errInfo.message = '오류가 발생 했습니다. 관리자에게 문의하세요';
    errInfo.message = err.message;
  }
  return res.status(errInfo.errCode).json({ success: errInfo.bSuccess, message: errInfo.message });
};

module.exports = handleErrors;
