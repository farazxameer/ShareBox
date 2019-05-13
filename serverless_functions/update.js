import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "files",
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      fileId: event.pathParameters.id
    },
    UpdateExpression: "SET filename = :filename",
    ExpressionAttributeValues: {
      ":filename": data.filename || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
