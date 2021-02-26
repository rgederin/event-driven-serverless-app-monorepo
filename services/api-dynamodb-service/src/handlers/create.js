import { v4 } from 'uuid';
import { success, failure } from '../utils/response';
import dynamodb from '../../../../libs/dynamodb-lib';

export async function main(event) {
    console.log("createVehicle lambda event: ", event);

    const dynamoDbParameters = buildDynamoDbParams(event);
    try {
        await dynamodb.put(dynamoDbParameters);
        return success(dynamoDbParameters.Item);
    } catch (e) {
        console.log("error: ", e);
        return failure({ status: false });
    }
}

const buildDynamoDbParams = event => {
    const data = JSON.parse(event.body);

    return {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: v4(),
            vehicle_brand: data.vehicle_brand,
            vehicle_model: data.vehicle_model,
            vehicle_year: data.vehicle_year,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }
    };
};