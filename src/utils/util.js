const trimToString = str => {
  if (typeof str == 'string') {
    return str.trim();
  }
};
const genPassword = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

const genAuthCode = () => {
  const authCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증번호 생성
  const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 현재 시간으로부터 5분 후의 시간 설정
  return { authCode, expirationTime };
};

module.exports = { trimToString, genPassword, genAuthCode };
