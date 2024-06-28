import {
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
dotenv.config();

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
});

const queueURL = process.env.AWS_QUEUE_URL;

export const sendUploadId = async (messageBody: string) => {
  const params = {
    QueueUrl: queueURL,
    MessageBody: messageBody,
    DelaySeconds: 0,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID: ", data.MessageId);
  } catch (err) {
    console.error("Error", err);
  }
};

export const sendStatusMessage = async (id: string, status: string) => {
  const params = {
    QueueUrl: process.env.AWS_QUEUE_URL,
    MessageBody: "Status update",
    MessageAttributes: {
      id: {
        DataType: "String",
        StringValue: id,
      },
      status: {
        DataType: "String",
        StringValue: status,
      },
    },
  };

  try {
    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);
    console.log("Message sent successfully", response.MessageId);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const getStatusById = async (
  targetId: string
): Promise<string | null> => {
  const params = {
    QueueUrl: process.env.AWS_QUEUE_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
    MessageAttributeNames: ["All"],
  };

  try {
    const command = new ReceiveMessageCommand(params);
    const response = await sqsClient.send(command);

    if (response.Messages) {
      for (const message of response.Messages) {
        const id = message.MessageAttributes?.id?.StringValue;
        const status = message.MessageAttributes?.status?.StringValue;

        if (id === targetId) {
          console.log(`Found status for ID ${targetId}: ${status}`);
          return status || null;
        }
      }
    }
    console.log(`No message found with ID: ${targetId}`);
    return null;
  } catch (error) {
    console.error("Error receiving messages:", error);
    return null;
  }
};
