import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
import { downloadFiles } from "./aws";
import { buildProject } from "./builder";
import { uploadFinalBuild } from "./uploadBuild";
import { updateStatus } from "./mongoStatus";
dotenv.config();

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
});

const queueURL = process.env.AWS_QUEUE_URL;

const infinitelyReceiveMessages = async () => {
  while (true) {
    try {
      const receiveParams = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
      };

      const data = await sqsClient.send(
        new ReceiveMessageCommand(receiveParams)
      );

      if (data.Messages && data.Messages.length > 0) {
        for (const message of data.Messages) {
          console.log("Received message: ", message.Body);

          await downloadFiles(`output/${message.Body}`);
          await buildProject(`${message.Body}`);
          await uploadFinalBuild(`${message.Body}`);
          await updateStatus(message.Body as string, "deployed")

          const deleteParams = {
            QueueUrl: queueURL, 
            ReceiptHandle: message.ReceiptHandle,
          }

          await sqsClient.send(new DeleteMessageCommand(deleteParams));
          console.log("Message Processed and deleted");
        }
      }else {
        console.log("No message received.")
      }
    } catch (err) {
      console.error("Error receiving messages: ", err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};


infinitelyReceiveMessages();

