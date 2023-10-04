const nodemailer = require('nodemailer');
const logger = require('./winston');

const smtpTransport = nodemailer.createTransport({
  service: '록톤컴퍼니즈코리아손해보험중개(주)',
  prot: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER_ID_NO_REPLY, // 발신 메일의 주소
    pass: process.env.SMTP_USER_PW_NO_REPLY // 발신 메일의 2차 비밀번호
  },

  tls: {
    rejectUnauthorized: false
  }
});

function sendMail(to, subject, body) {
  if (process.env.SMTP_USE_YN !== 'Y') return true;

  const mailOptions = {
    from: `"록톤코리아"<${process.env.SMTP_USER_ID_NO_REPLY}>`,
    to,
    subject,
    html: body
  };
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        logger.error('Failed to send email', error);
        reject(error);
      } else {
        logger.info(`Email sent to ${to}: ${response.response}`);
        resolve(response);
      }
    });
  });
}

function sendMailFromTemplete(params) {
  if (process.env.SMTP_USE_YN !== 'Y') return true;

  const mailOptions = {
    from: `"록톤코리아"<${process.env.SMTP_USER_EMAIL_NO_REPLY}>`,
    to: params.to,
    subject: params.subject,
    html: params.contents
  };
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        logger.error('Failed to send email', error);
        reject(error);
      } else {
        logger.info(`Email sent to ${to}: ${response.response}`);
        resolve(response);
      }
    });
  });
}

module.exports = {
  sendMail,
  sendMailFromTemplete
};
