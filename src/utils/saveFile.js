const logger = require('../config/winston');
const fs = require('fs');
const path = require('path');

const saveFile = (req, result) => {
    const jsonData = req.body.params;
    const fileName = jsonData.fileName;
    const fileType = jsonData.fileType;
    const fileData = jsonData.fileData;
    const userNM = jsonData.user_nm;
    const insrYear = jsonData.insr_year;

    if (fileName && fileData){
        const uploadFolderPath = path.join(process.cwd(), 'uploads', 'CAA');
        if (!fs.existsSync(uploadFolderPath)) {
            fs.mkdirSync(uploadFolderPath, { recursive: true });
        }
        const newFileName = `${insrYear}_${userNM}_${fileName}`
        if(result) {
            const oriFileName = `${result.insr_year}_${result.user_nm}_${result.insr_income_filename}`
            
            if(oriFileName != newFileName){
                const filePathToDelete = path.join(process.cwd(), 'uploads', 'CAA', oriFileName);
                fs.unlink(filePathToDelete, (err) => {
                if (err) {
                  logger.error('Error deleting file:', err);
                } else {
                  logger.info('File deleted successfully');
                }
              });
            }
        }

        // Base64를 디코딩하여 파일로 저장
        const decodedFile = Buffer.from(fileData, 'base64');
        fs.writeFileSync(path.join(uploadFolderPath, newFileName), decodedFile);
    }
};

const downloadFile = (req) => {
  const jsonData = req.body.params;
  const fileName = jsonData.fileName;
  const userNM = jsonData.user_nm;
  const insrYear = jsonData.insr_year;

  if (fileName) {
    // 파일 경로 설정
    const filePath = path.join(process.cwd(), 'uploads', 'CAA', `${insrYear}_${userNM}_${fileName}`);

    // 파일이 존재하는지 확인
    if (fs.existsSync(filePath)) {
        try {
            // 파일 읽기
            const fileData = fs.readFileSync(filePath);
            
            // Base64로 인코딩
            const base64Data = fileData.toString('base64');
            
            // 응답 데이터 생성
            const responseData = {
                fileName: fileName,
                fileData: base64Data,
            };
            
            // JSON으로 응답
            return [responseData, ''];
        } catch (err) {
            // 오류 발생 시 처리
            return [null, 'Error reading file'];
        }
    } else {
        // 파일이 없을 경우 처리
        return [null, 'File not found'];
    }
  } else {
    // 요청에 파일 이름이 없을 경우 처리
    return [null, 'File name is required'];
  }
}

module.exports = { saveFile, downloadFile };