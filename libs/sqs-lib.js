import AWS from "./aws-sdk";

const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

export default {
    sendMessage: (params) => SQS.sendMessage(params).promise()
};