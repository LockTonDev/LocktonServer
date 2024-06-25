const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const logger = require('./winston');
const { StatusMessage } = require('../utils/response');
const db = require('./db');
const User = require('../models/user');
const M_TTAX0030A = require('../models/M_TTAX0030A');

const localStrategyOption = {
  usernameField: 'user_id',
  passwordField: 'user_pwd',
  passReqToCallback: true
};
// console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
const jwtStrategyOption = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

async function localVerify(req, user_id, user_pwd, done) {
  try {
    const userInfo = await User.signIn(req.body.business_cd, req.body.user_cd, user_id, user_pwd);
    let isAuth = bcrypt.compareSync(user_pwd, userInfo[0].user_pwd);
    const loginBlockYn = userInfo[0].login_block_yn;

    logger.error('passport isAuth  : ' + isAuth);
    //isAuth = true;
    if (!isAuth) {
      await User.updateLoginCnt(req.body.business_cd, req.body.user_cd, user_id);
      return done(null, false);
    } else if (loginBlockYn === 'Y') {
      return done(null, userInfo);
    } else {
      await User.updateLoginCntZero(req.body.business_cd, req.body.user_cd, user_id);
    }

    /**
     *
     * 추후 회원가입시에만 작동하도록 변경 예정
     */
    // 업데이트
    const params = {
      business_cd: userInfo[0].business_cd,
      user_cd: userInfo[0].user_cd,
      user_id: userInfo[0].user_id,
      user_nm: userInfo[0].user_nm,
      user_birth: userInfo[0].user_birth,
      user_regno: userInfo[0].user_regno,
      user_uuid: userInfo[0].user_uuid,
      corp_cnno: userInfo[0].corp_cnno,
      updated_id: userInfo[0].user_id,
      updated_ip: ''
    };
    //logger.debug(params);
    if (userInfo[0].business_cd !== 'ADM') M_TTAX0030A.updateUserInfo(params);

    return done(null, userInfo);
    // return done(null, null);
  } catch (e) {
    logger.error('PASSPORT localVerify Error : ', e);
    return done(e);
  }
}

async function jwtVerify(payload, done) {
  logger.error('jwtVerify:' + payload);

  let user;
  try {
    const sqlSelect = `SELECT business_cd, user_uuid, user_id, user_pwd, user_nm, user_cd, user_birth, user_regno, status_cd FROM TCOM0110A WHERE user_uuid = ? and status_cd not in ('90')`;

    await db
      .query(sqlSelect, payload.user_uuid)
      .then(rows => {
        if (!rows[0]) return done(null, false);
        user = rows[0];

        return done(null, user);
      })
      .catch(err => {
        logger.error('passport jwtVerify ERROR : ' + err);
        return done(null, false);
      });
  } catch (e) {
    return done(e);
  }
}
module.exports = () => {
  passport.use(new LocalStrategy(localStrategyOption, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerify));
};
