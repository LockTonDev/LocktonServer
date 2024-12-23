


// const secretKey = 'mySecretKey';
// const ivKey = process.env.IV_KEY;
// const key = 'Qsj23missdaxX2BjyskV6bs#adada6ds';

const crypto = require('crypto');
const izkey = process.env.IZ_KEY
const iv = process.env.IV_KEY
let secretKey =  process.env.ENCRYPT_KEY

//암호화 AES256
function getEncryptData(data) {
  try {
    const iv = Buffer.alloc(16, 0); //16비트
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encryptedText = cipher.update(data, 'utf8', 'base64');
    encryptedText += cipher.final('base64');
    return encryptedText;
  } catch(e) {
    return data
  }
}

//복호화 AES256
function getDecryptData(data ) {
  try {
    const iv = Buffer.alloc(16, 0); // 16비트
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decryptedText = decipher.update(data, 'base64', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
  } catch(e) {
    return data
  }
}

function encryptUserInfo(result) {
  result.user_nm = getEncryptData(result.user_nm)
  result.user_hpno = getEncryptData(result.user_hpno)
  result.corp_telno = getEncryptData(result.corp_telno)
  result.user_email = getEncryptData(result.user_email)
  result.user_birth = getEncryptData(result.user_birth)
  result.corp_ceo_nm = getEncryptData(result.corp_ceo_nm)
  result.corp_cust_nm = getEncryptData(result.corp_cust_nm)
  result.corp_cust_hpno = getEncryptData(result.corp_cust_hpno)
  result.corp_cust_email = getEncryptData(result.corp_cust_email)
  return result
}
function decryptUserInfo(result) {
  result.user_nm = getDecryptData(result.user_nm)
  result.user_hpno = getDecryptData(result.user_hpno)
  result.corp_telno = getDecryptData(result.corp_telno)
  result.user_email = getDecryptData(result.user_email)
  result.user_birth = getDecryptData(result.user_birth)
  result.corp_ceo_nm = getDecryptData(result.corp_ceo_nm)
  result.corp_cust_nm = getDecryptData(result.corp_cust_nm)
  result.corp_cust_hpno = getDecryptData(result.corp_cust_hpno)
  result.corp_cust_email = getDecryptData(result.corp_cust_email)
  return result
}

module.exports = {
  getEncryptData, getDecryptData,encryptUserInfo,decryptUserInfo
};
