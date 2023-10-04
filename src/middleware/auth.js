const logger = require('../config/winston');
const jwt = require('jsonwebtoken');
const { StatusCode, StatusMessage } = require('../utils/response');
const { Unauthorized } = require('../utils/errors');

exports.verifyToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET_KEY;

    req.decoded = jwt.verify(accessToken, jwtSecret);

    return next();
  } catch (err) {
    logger.error('verifyToken error : ', err);
    return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: StatusMessage.unValidateToken });
  }
};
