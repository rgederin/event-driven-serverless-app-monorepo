import { success, failure } from '../utils/response';
import dynamodb from '../../../../libs/dynamodb-lib';

export async function main(event) {
    console.log("deleteVehicle lambda event: ", event);

    const dynamoDbParameters = buildDynamoDbParams(event);
    try {
        await dynamodb.delete(dynamoDbParameters);
        return success({ status: true });
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