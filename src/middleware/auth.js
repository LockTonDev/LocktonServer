const logger = require('../config/winston');
const jwt = require('jsonwebtoken');
const { StatusCode, StatusMessage } = require('../utils/response');
const { Unauthorized } = require('../utils/errors');
const blockAdmUUID = ['5344678a-4fa2-4fdb-a7a9-b3eb80eaf688']
exports.verifyToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET_KEY;

    req.decoded = jwt.verify(accessToken, jwtSecret);
    if(blockAdmUUID.includes(req.decoded.uuid) && req.originalUrl.indexOf("ADM") > -1 && (req.originalUrl.indexOf("set") > -1 || req.originalUrl.indexOf("EXCEL") > -1)) {
      return res.status(StatusCode.OK).json({ success: false, message: StatusMessage.limitedAdmin,errorCode : StatusCode.UNAUTHORIZED });
    }
    return next();
  } catch (err) {
    logger.error('verifyToken error : ', err);
    return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: StatusMessage.unValidateToken});
  }
};
