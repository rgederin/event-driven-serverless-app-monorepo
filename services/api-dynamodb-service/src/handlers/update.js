import { success, failure } from '../utils/response';
import dynamodb from '../../../../libs/dynamodb-lib';

export async function main(event) {
    console.log("updateVehicle lambda event: ", event);

    const dynamoDbParameters = buildDynamoDbParams(event);
    try {
        await dynamodb.update(dynamoDbParameters);
        return success({ status: true });
    } catch (e) {
        console.log("error: ", e);
        return failure({ status: false });
    }
}

const buildDynamoDbParams = event => {
    const data = JSON.parse(event.body);

    return {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ":vehicle_brand": data.vehicle_brand,
            ":vehicle_model": data.vehicle_model,
            ":vehicle_year": data.vehicle_year,
            ":updatedAt": new Date().getTime()
        },
        UpdateExpression:
            "SET vehicle_brand = :vehicle_brand, vehicle_model = :vehicle_model, vehicle_year = :vehicle_year, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
    };
};