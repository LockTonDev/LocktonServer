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


module.exports = { saveFile };