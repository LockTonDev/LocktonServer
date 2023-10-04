const logger = require('./winston');
const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

module.exports = require('knex')({
  client: 'mysql2',
  debug: builder => {
    const { sql, bindings } = builder.toSQL();
    logger.debug(`[Query]: ${sql.replace(/\?/g, () => bindings.shift())}`);
  },
  connection,
  asyncStackTraces: true,
  pool: {
    min: 0,
    max: 20
  },

  //커넥션 타임아웃 시간 설정 ms 단위
  acquireConnectionTimeout: 10000,

  //로그 설정
  log: {
    warn(msg) {
      logger.warning(msg);
    },
    error(msg) {
      logger.error(msg);
    },
    deprecate(msg) {
      logger.deprecate(msg);
    },
    debug(msg) {
      logger.debug(msg);
    }
  }
});
