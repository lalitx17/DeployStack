import express from "express";
import cors from "cors";
import { idGenerator } from "./idGenerator";
import {simpleGit} from "simple-git";

const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", async(req, res) => {
    const repoUrl = req.body.repoUrl;   
    const id = idGenerator(5);  
    await simpleGit().clone(repoUrl, `output/${id}`);

    res.json({
        id: id
    })
})


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
