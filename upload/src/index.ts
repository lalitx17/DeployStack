import express from "express";
import cors from "cors";
import { idGenerator } from "./idGenerator";
import { getAllFiles } from "./getAllFiles";
import {simpleGit} from "simple-git";
import { uploadFiles } from "./aws";
import { sendUploadId } from "./aws-sqs";

import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", async(req, res) => {
    const repoUrl = req.body.repoUrl;   
    const id = idGenerator(5);  
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    res.json({
        id: id
    })

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async (file) => {
        await uploadFiles(file.slice(__dirname.length + 1), file);
    });

    await sendUploadId(id);
})


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
