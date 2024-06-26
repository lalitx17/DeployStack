import express from "express";
import cors from "cors";
import { idGenerator } from "./idGenerator";
import { getAllFiles } from "./getAllFiles";
import {simpleGit} from "simple-git";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
  

const app = express();
app.use(cors());
app.use(express.json());


async function listBuckets() {
    try {
      const command = new ListBucketsCommand({});
      const response = await client.send(command);
      console.log("Buckets:", response.Buckets);
    } catch (error) {
      console.error("Error listing buckets:", error);
    }
  }
  
  listBuckets();

  
app.post("/deploy", async(req, res) => {
    const repoUrl = req.body.repoUrl;   
    const id = idGenerator(5);  
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    res.json({
        id: id
    })

    const files = getAllFiles(path.join(__dirname, `output/${id}`));



})


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
