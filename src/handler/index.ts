import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log("handle v4", event);

  try {
    if (event.path === "/v1/tickets" && event.httpMethod === "POST") {
      if (event.body === null) throw new Error("Body is null");

      const json = JSON.parse(event.body);

      const ticket = {
        id: crypto.randomUUID(),
        ...json,
      };

      const command = new PutCommand({
        TableName: "dev-tsb-ddb-tickets",
        Item: ticket,
      });

      const responseDB = await docClient.send(command);
      console.log(responseDB);

      const response = {
        statusCode: 201,
        body: JSON.stringify(ticket),
      };
      return response;
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Path not found" }),
    };
  } catch (e) {
    console.error("Error in handler", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
