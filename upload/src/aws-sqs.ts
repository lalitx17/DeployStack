import {QueueAttributeName, SQSClient, SendMessageCommand} from "@aws-sdk/client-sqs";
import * as dotenv from 'dotenv';
dotenv.config();

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
})

const queueURL = process.env.AWS_QUEUE_URL


export const sendUploadId = async (messageBody: string) => {
    const params = {
        QueueUrl: queueURL, 
        MessageBody: messageBody, 
        DelaySeconds: 0
    };

    try{
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID: ", data.MessageId);
    } catch(err){
        console.error("Error", err);
    }
}