
// const crypto = require('crypto');
// const secretKey = 'mySecretKey';
// const ivKey = process.env.IV_KEY;
// const key = 'Qsj23missdaxX2BjyskV6bs#adada6ds';

const crypto = require('crypto');
const izkey = process.env.IZ_KEY


/** 원하는 위치에 문자열 추가
 * originalString : 원래의 문자열,
 * position: 삽입하려는 위치 (0부터 시작),
 * insertion: 삽입할 문자열,
 * isFront : true일 경우 앞쪽에서 삽입, false일 경우 뒷쪽에서 삽입 */
function insertString(originalString, position, insertion, isFront) {
  try {
    if (position < 0 || position > originalString.length) {
      throw new Error('유효하지 않은 삽입 위치입니다.');
    }
    if (isFront) {
      return originalString.slice(0, position) + insertion + originalString.slice(position);
    } else {
      return originalString.slice(0, -position) + insertion + originalString.slice(-position);
    }
  } catch (error) {
    console.error('오류:', error.message);
  }

}

/** 원하는 위치에 문자열 자르기
 * originalString: 원래 문자열
 * position: 자르려는 위치 (0부터 시작)
 * length: 자르려는 문자열의 길이
 * fromFront: true일 경우 앞에서 자르고, false일 경우 뒤에서 자름
 */
function cutString(originalString, position, length, fromFront) {
  try {
    if (position < 0 || position > originalString.length) {
      throw new Error('유효하지 않은 자르기 위치입니다.');
    }
    if (length < 0 || length > originalString.length - position) {
      throw new Error('유효하지 않은 길이입니다.');
    }
    if (fromFront) {
      const cutPart = originalString.slice(position, position + length);
      const remainingPart = originalString.slice(0, position) + originalString.slice(position + length);
      return { cutPart, remainingPart };
    } else {
      const cutPart = originalString.slice(-position - length, -position);
      const remainingPart = originalString.slice(0, -position - length) + originalString.slice(-position);
      return { cutPart, remainingPart };
    }
  } catch (error) {
    console.error('오류:', error.message);
  }
}



/** 암호화할 함수 text, key */
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  console.log("iv : ",iv)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}
/** 복호화할 함수 encryptedData, key, iv */
function decrypt(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
/** 데이터를 암호화 dataToEncrypt, secretKey */
function getEncrypt (dataToEncrypt, secretKey) {
  const { iv, encryptedData } = encrypt(dataToEncrypt, secretKey);
  //console.log('암호화된 데이터: ' + encryptedData);
  //console.log('IV (Initialization Vector): ' + iv);
  return { iv, encryptedData };
}
/** 암호화된 데이터를 복호화 encryptedData, secretKey, iv */
function getDecrypt (encryptedData, secretKey, iv) {
  const decryptedData = decrypt(encryptedData, secretKey, iv);
  //console.log('복호화된 데이터: ' + decryptedData);
  return decryptedData;
}



/** 데이터를 암호화 울트라 data */
function getEncryptData (data) {
  try {
    let key12 = modules_a.getRandom(12);
    let secretKey = izkey.slice(0,10);
    secretKey += key12;
    secretKey += izkey.slice(10,20);
    let edata = getEncrypt(data, secretKey);
    let cal = edata.encryptedData;
    let iv = edata.iv;
    let secret1 = modules_a.getRandomNumberSequence(1);
    let secret2 = modules_a.getRandomNumberSequence(2);
    cal += secret1;
    const modifiedString_iv = insertString(cal, secret2.slice(1,2), iv, true);
    const modifiedString_secretKey = insertString(modifiedString_iv, secret2.slice(0,1), key12, false);
    const modifiedString = insertString(modifiedString_secretKey, secret1, secret2, false);
    return modifiedString;
  } catch (error) {
    console.error('오류:', error.message);
  }

}
/** 암호화된 데이터를 복호화 울트라 data */
function getDecryptData (data) {
  try {
    let nums = data.slice(-1);
    // let decryptedData = data;
    const modifiedString = cutString(data, nums, 2, false);
    const modifiedString_secretKey = cutString(modifiedString.remainingPart, parseInt(modifiedString.cutPart.slice(0,1)), 12, false);
    const modifiedString_iv = cutString(modifiedString_secretKey.remainingPart, parseInt(modifiedString.cutPart.slice(1,2)), 32, true);
    let secretKey = izkey.slice(0,10);
    secretKey += modifiedString_secretKey.cutPart;
    secretKey += izkey.slice(10,20);
    const decryptedData = getDecrypt(modifiedString_iv.remainingPart.slice(0, modifiedString_iv.remainingPart.length-1), secretKey, modifiedString_iv.cutPart);
    return decryptedData;
  } catch (error) {
    console.error('오류:', error.message);
  }
}

module.exports = {
  getEncryptData, getDecryptData
};
