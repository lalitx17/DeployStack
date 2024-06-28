"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFiles = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv.config();
const client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const downloadSingleFile = (bucket, key, localPath) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
    const response = yield client.send(command);
    if (!response.Body) {
        throw new Error('Response body is undefined');
    }
    const body = response.Body;
    const fileBuffer = yield new Promise((resolve, reject) => {
        const chunks = [];
        body.on('data', (chunk) => chunks.push(chunk));
        body.on('end', () => resolve(Buffer.concat(chunks)));
        body.on('error', (err) => reject(err));
    });
    // Ensure the directory exists
    const dir = path_1.default.dirname(localPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    fs_1.default.writeFileSync(localPath, fileBuffer);
    console.log(`File downloaded successfully to ${localPath}`);
});
const downloadFiles = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    const bucket = 'litx17-deploystack';
    const baseDir = __dirname;
    try {
        const listCommand = new client_s3_1.ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
        });
        const listResponse = yield client.send(listCommand);
        if (!listResponse.Contents) {
            console.log('No files found with the given prefix');
            return;
        }
        for (const file of listResponse.Contents) {
            if (file.Key) {
                const localPath = path_1.default.join(baseDir, file.Key);
                yield downloadSingleFile(bucket, file.Key, localPath);
            }
        }
        console.log('All files downloaded successfully');
    }
    catch (error) {
        console.error("Error downloading files: ", error);
        throw error;
    }
});
exports.downloadFiles = downloadFiles;
