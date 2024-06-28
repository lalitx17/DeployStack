import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import { Readable } from "stream";


dotenv.config();

const app = express();

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});


app.get("/*", async (req, res) => {
  try {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filepath = req.path;

    const downloadParams = {
      Bucket: "litx17-deploystack",
      Key: `dist/${id}${filepath}`,
    };

    const command = new GetObjectCommand(downloadParams);
    const s3Response = await client.send(command);

    if (!s3Response.Body) {
      throw new Error("Response body is undefined");
    }

    const type = filepath.endsWith("html")
      ? "text/html"
      : filepath.endsWith("css")
      ? "text/css"
      : "application/javascript";

    res.set("Content-Type", type);

    if (s3Response.Body instanceof Readable) {
      s3Response.Body.pipe(res);
    } else {
      const bodyContents = await s3Response.Body.transformToByteArray();
      res.send(Buffer.from(bodyContents));
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request");
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});



