import { success, failure } from '../utils/response';
import dynamodb from '../../../../libs/dynamodb-lib';

export async function main(event) {
    console.log("listVehicles lambda event: ", event);

    const dynamoDbParameters = buildDynamoDbParams(event);
    try {
        const result = await dynamodb.scan(dynamoDbParameters);
        return success(result.Items);
    } catch (e) {
        console.log("error: ", e);
        return failure({ status: false });
    }
};

const buildDynamoDbParams = () => {
    return {
        TableName: process.env.DYNAMODB_TABLE
    };
};