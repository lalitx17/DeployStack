import { S3Client, ListBucketsCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });


  export const uploadFiles = async(fileName: string, localFilePath: string) => {
    try {
      const filecontent = fs.readFileSync(localFilePath);
      const uploadParams = {
        Bucket: 'litx17-deploystack',
        Key: fileName, 
        Body: filecontent
      };
  
      const command = new PutObjectCommand(uploadParams);
  
      const response = await client.send(command);
      console.log("File uploaded Successfully", response);
    } catch(error) {
      console.error("Error uploading file: ", error);
    }
  };




//   async function listBuckets() {
//     try {
//       const command = new ListBucketsCommand({});
//       const response = await client.send(command);
//       console.log("Buckets:", response.Buckets);
//     } catch (error) {
//       console.error("Error listing buckets:", error);
//     }
//   }
  
//   listBuckets();