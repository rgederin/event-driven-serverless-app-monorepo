import { success, failure } from '../utils/response';
import dynamodb from '../../../../libs/dynamodb-lib';

export async function main(event) {
    console.log("getVehicle lambda event: ", event);

    const dynamoDbParameters = buildDynamoDbParams(event);
    try {
        const result = await dynamodb.get(dynamoDbParameters);
        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found." });
        }
    } catch (e) {
        console.log("error: ", e);
        return failure({ status: false });
    }
};

const buildDynamoDbParams = event => {
    return {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    };
};