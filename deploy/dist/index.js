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
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const sqsClient = new client_sqs_1.SQSClient({
    region: process.env.AWS_REGION,
});
const queueURL = process.env.AWS_QUEUE_URL;
const infinitelyReceiveMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        try {
            const receiveParams = {
                QueueUrl: queueURL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 20,
            };
            const data = yield sqsClient.send(new client_sqs_1.ReceiveMessageCommand(receiveParams));
            if (data.Messages && data.Messages.length > 0) {
                for (const message of data.Messages) {
                    console.log("Received message: ", message.Body);
                }
            }
        }
        catch (err) {
            console.error("Error receiving messages: ", err);
            yield new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
});
infinitelyReceiveMessages();
