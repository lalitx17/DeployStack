import { S3Client, GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Readable } from "stream";
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const downloadSingleFile = async (bucket: string, key: string, localPath: string): Promise<void> => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response: GetObjectCommandOutput = await client.send(command);

  if (!response.Body) {
    throw new Error('Response body is undefined');
  }

  const body = response.Body as Readable;

  const fileBuffer: Buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    body.on('data', (chunk: Buffer) => chunks.push(chunk));
    body.on('end', () => resolve(Buffer.concat(chunks)));
    body.on('error', (err: Error) => reject(err));
  });

  // Ensure the directory exists
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(localPath, fileBuffer);
  console.log(`File downloaded successfully to ${localPath}`);
};



export const downloadFiles = async (prefix: string): Promise<void> => {
  const bucket = 'litx17-deploystack';
  const baseDir = __dirname;

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const listResponse = await client.send(listCommand);

    if (!listResponse.Contents) {
      console.log('No files found with the given prefix');
      return;
    }

    for (const file of listResponse.Contents) {
      if (file.Key) {
        const localPath = path.join(baseDir, file.Key);
        await downloadSingleFile(bucket, file.Key, localPath);
      }
    }

    console.log('All files downloaded successfully');
  } catch (error) {
    console.error("Error downloading files: ", error);
    throw error;
  }
};
