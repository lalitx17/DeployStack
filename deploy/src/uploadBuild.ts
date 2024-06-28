import { S3Client, ListBucketsCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  export const uploadFinalBuild = async (id: string) => {
     const folderPath = path.join(__dirname, `output/${id}/dist`);
     const allFiles = getAllFiles(folderPath);

    allFiles.forEach(async (file) => {
        await uploadFile(`dist/${id}/` + file.slice(folderPath.length+1), file);
    });

    console.log("Build Uploaded")
  }


  export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath))
        }else{
            response.push(fullFilePath);
        }
    })

    return response; 
}


  const uploadFile = async(fileName: string, localFilePath: string) => {
    try {
      const filecontent = fs.readFileSync(localFilePath);
      const uploadParams = {
        Bucket: 'litx17-deploystack',
        Key: fileName, 
        Body: filecontent
      };
  
      const command = new PutObjectCommand(uploadParams);
  
      const response = await client.send(command);
    } catch(error) {
      console.error("Error uploading file: ", error);
    }
  };


