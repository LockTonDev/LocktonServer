const mysql = require('mysql2/promise');
const logger = require('./winston');

const TAG_SUCCESS = 'DB success create pool!!';
const TAG_PROTOCOL_CONNECTION_LOST = 'Database connection was closed.';
const TAG_ER_CON_COUNT_ERROR = 'Database has too many connections.';
const TAG_ECONNREFUSED = 'Database connection was refused.';

const format = { language: 'sql', indent: '  ' };
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

const generateSQL = async (str, args) => {
  let sqlQuery = '';
  await Promise.all(
    args.map(async parameter => {
      sqlQuery += mysql.format(str, parameter);
    })
  );
  logger.debug('generateSQL : ', sqlQuery);
  return sqlQuery;
};

module.exports = {
  connection: async function () {
    const connection = await pool.getConnection(async conn => conn);
    try {
      return connection;
    } catch (err) {
      switch (err.code) {
        case 'PROTOCOL_CONNECTION_LOST':
          logger.error(TAG_PROTOCOL_CONNECTION_LOST);
          break;
        case 'ER_CON_COUNT_ERROR':
          logger.error(TAG_ER_CON_COUNT_ERROR);
          break;
        case 'ECONNREFUSED':
          logger.error(TAG_ECONNREFUSED);
          break;
      }
    }
  },
  query: async function (query, ...args) {
    let rows;
    let sqlQuery;

    const connection = await this.connection(async conn => conn);
    if (!args) {
      rows = await connection.query(query);
    } else {
      sqlQuery = '';
      await Promise.all(
        args.map(async parameter => {
          sqlQuery += mysql.format(query, parameter);
        })
      );
      rows = await connection.query(sqlQuery);
    }
    logger.debug('---------------------------------S query');
    logger.debug('SQL : ' + sqlQuery);
    logger.debug('ROWS : ', rows[0]);
    logger.debug('1---------------------------------E query\r\n\r\n');
    connection.release();

    return rows;
  },
  queryWithTransaction: async function (query, ...args) {
    let rows;
    let sqlQuery;

    const connection = await this.connection(async conn => conn);
    await connection.beginTransaction();
    if (!args) {
      rows = await connection
        .query(query)
        .then(await connection.commit())
        .catch(await connection.rollback());
    } else {
      sqlQuery = '';
      await Promise.all(
        args.map(async parameter => {
          sqlQuery += mysql.format(query, parameter);
        })
      );

      rows = await connection
        .query(sqlQuery)
        .then(await connection.commit())
        .catch(await connection.rollback());
    }

    connection.release();
    logger.debug('2---------------------------------S query');
    logger.debug('SQL : ', sqlQuery);
    logger.debug('ROWS : ', rows[0]);
    logger.debug('2---------------------------------E query\r\n\r\n');

    return rows;
  },
  queryListWithTransaction: async function (queries, parameters) {
    let rows;
    const connection = await this.connection(async conn => conn);
    await connection.beginTransaction();

    try {
      const executeQueries = async () => {
        return await Promise.all(queries.map(async (query, index) => {
          console.log(query)
          const result = await connection.query(query, parameters[index]);
          return result[0];
        }));
      };

      rows = await executeQueries();
      await connection.commit();
    } catch (error) {
      console.log(error)
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    logger.debug('2---------------------------------S query');
    logger.debug('SQL Queries:', queries);
    logger.debug('ROWS:', rows);
    logger.debug('2---------------------------------E query\r\n\r\n');

    return rows;
  },

  select: async function (queryID, sqlParam) {
    const connection = await this.connection(async conn => conn);
    logger.debug('queryID  : ' + queryID);
    logger.debug('sqlParam  : ' + sqlParam);
    try {
      let queryIdArr = queryID.split('.');
      let query = mybatisMapper.getStatement(queryIdArr[0], queryIdArr[1], sqlParam, format);

      logger.debug('query  : ' + query);
      let result = await connection.query(query, sqlParam, result => result);
      logger.debug('rtn length : ' + result[0].length);
      // logger.debug('rtn length : ' + JSON.stringify(result[0]));

      return result[0];
    } catch (e) {
      throw e;
    } finally {
      connection.release();
    }
  },
  fetch: async function (queryID, rows) {
    const connection = await this.connection(async conn => conn);
    let sqlQuery;
    let results = [];

    try {
      await connection.beginTransaction(); // 트랜잭션 시작

      for (let row of rows) {
        let queryIdArr = queryID.split('.');
        let query = mybatisMapper.getStatement(queryIdArr[0], queryIdArr[1], row, format);
        let result = await connection.query(query, row, result => result);
        results.push(result);
      }
      await connection.commit(); // 트랜잭션 커밋

      return results;
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  },
  fetch2: async function (queryID, sqlParam) {
    const connection = await this.connection(async conn => conn);

    try {
      logger.debug('queryID  : ' + queryID);
      logger.debug('sqlParam  : ' + JSON.stringify(sqlParam));
      let queryIdArr = queryID.split('.');
      let query = mybatisMapper.getStatement(queryIdArr[0], queryIdArr[1], sqlParam, format);
      logger.debug('query  : ' + query);
      let result = await connection.query(query, sqlParam, result => result);
      logger.debug('result  : ' + result[0]);
      logger.debug('affectedRows : ' + result[0].affectedRows);

      return result;
    } catch (e) {
      connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }
};
