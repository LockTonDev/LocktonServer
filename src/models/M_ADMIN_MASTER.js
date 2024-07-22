const logger = require('../config/winston');
const { NotFound, Conflict } = require('../utils/errors');
const { StatusMessage } = require('../utils/response');
const db = require('../config/db');
const knexDB = require('../config/knexDB');
const AdminMasterMapper = require('../mapper/AdminMasterMapper');

module.exports = {
  
  getInsuranceMaster: async function (req) {
    const params = req.body.params;
    const queryParams = [
      params.business_cd,
      params.business_cd,
      params.user_cd,
      params.user_cd,
      params.insr_year,
      params.insr_year
    ];
    const [rowsInsrInfo] = await db.query(AdminMasterMapper.INSURANCE_LIST, queryParams);
    if (rowsInsrInfo.affectedRows < 1) {
      throw new NotFound(StatusMessage.SELECT_FAILED);
    }
    return Object.setPrototypeOf(rowsInsrInfo, []);
  },
  
  setInsuranceMaster: async function (req) {
    const params = req.body.params;
    let querys = []
    let query_params = []
    for(const param of params){
      param.rn_st_dt= param.rn_st_dt?.trim() ? param.rn_st_dt : '';
      param.rn_en_dt= param.rn_en_dt?.trim() ? param.rn_en_dt : '';
      if (param.mode === 'C') {
        const insert_params = [
          param.base_year, param.ver, param.user_cd, param.business_cd, param.insr_st_dt, param.insr_cncls_dt,
          param.days, param.insurance_nm, JSON.stringify(param.contents), param.insurance_no, param.use_yn, param.rn_st_dt,
          param.rn_en_dt, param.created_id, param.updated_id
        ]
        querys.push(AdminMasterMapper.INSURANCE_INSERT)
        query_params.push(insert_params)
      }
      else if (param.mode === 'U') {
        const update_params = [
          param.insr_st_dt, param.insr_cncls_dt,
          param.days, param.insurance_nm, JSON.stringify(param.contents), param.insurance_no, param.use_yn, param.rn_st_dt,
          param.rn_en_dt, param.updated_id, 
          param.base_year, param.ver, param.user_cd, param.business_cd
        ]

        querys.push(AdminMasterMapper.INSURANCE_UPDATE)
        query_params.push(update_params)
      }
      else if (param.mode === 'D'){
        const delete_params = [
          param.base_year, param.ver, param.user_cd, param.business_cd
        ]
        querys.push(AdminMasterMapper.INSURANCE_DELETE)
        query_params.push(delete_params)
      }
    }
    logger.debug(query_params);
    const rows_results = await db.queryListWithTransaction(querys, query_params);
    //const resultData = await knexDB.raw(AdminMapper.INSURANCE_LIST, params);
    for(const rows of rows_results){
      if (rows.affectedRows < 1) {
        throw new NotFound(StatusMessage.SELECT_FAILED);
      }
    }
    return true;
  },
  chkDupInsuranceMaster: async function (req) {
    const params = req.body.params;
    const queryParams = [
      params.base_year,
      params.ver,
      params.user_cd,
      params.business_cd
    ];
    const rowsInsrInfo = await db.query(AdminMasterMapper.INSURANCE_SELECT_DUP, queryParams);
    return rowsInsrInfo[0];
  },
  updateInsuranceNoMaster: async function (params, tableName) {
    let query = 'update tcom0030a set insurance_no = ? where base_year = ? and user_cd = ? and ver = ? and business_cd = ? ';
    const queryParams = [
      params.insurance_no,
      params.base_year,
      params.user_cd,
      params.ver,
      params.business_cd
    ];

    const [rows] = await db.query(query, queryParams);

    if (rows.affectedRows < 1) {
      return false;
    }
    return true;
  },
  updateContract0030a: async function (params, tableName) {
    let query = 'update '+tableName+' set insurance_no = ? where insr_year = ? and business_cd = ? ';
    const queryParams = [
      params.insurance_no,
      params.base_year,
      params.business_cd
    ];
    const [rows] = await db.query(query, queryParams);

    // if (rows.affectedRows < 1) {
    //   return false;
    // }
    return rows.affectedRows;
  },
  updateRenewal0031a: async function (params, tableName) {
     let query = 'update '+tableName+' set insurance_no = ? where insr_year = ? and business_cd = ? ';
     const queryParams = [
      params.insurance_no,
      params.base_year,
      params.business_cd
    ];
 
    const [rows] = await db.query(query, queryParams);

    // if (rows.affectedRows < 1) {
    //   return false;
    // }
    return rows.affectedRows;
  },
};
