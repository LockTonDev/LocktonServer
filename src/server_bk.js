const express = require('express');
const cors = require('cors');

const app = express();
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const logger = require('./config/winston');

require('dotenv').config();

const port = process.env.SERVER_PORT;
const nodeEnv = process.env.NODE_ENV;

const passport = require('passport');
const passportConfig = require('./config/passport');

const handleErrors = require('./middleware/handleError');
const { NotFound } = require('./utils/errors');
const { StatusMessage } = require('./utils/response');

const rateLimit = require('./middleware/rateLimiter');
const useragent = require('express-useragent');

app.use(helmet());
app.use(hpp());
if (nodeEnv === 'run') {
  morganFormat = 'combined'; // Apache 표준
} else {
  morganFormat = 'dev';
}

app.use(morgan(morganFormat, { stream: logger.stream }));

let isDisableKeepAlive = false;
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close');
  }
  next();
});

const server = app.listen(port, () => {
  logger.info(`Server on port ${port} | ${nodeEnv}`);
});

process.on('SIGINT', function () {
  isDisableKeepAlive = true;
  server.close(function () {
    /** 앱 종료*/
    logger.info('Server off');
  });
});

// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

/** DDos 공격 방지 */
app.use(rateLimit);

/** passport 설정 */
app.use(passport.initialize());
passportConfig();

/** router 설정 */
app.use(require('./routes/index'));

app.use(handleErrors);

/** 에러페이지 및 에러 핸들링 */
app.use((req, res, next) => {
  logger.debug(res);
  throw new NotFound(StatusMessage.RequestWithIntentionalInvalidUrl);
});

module.exports = app;
