import AWS from "./aws-sdk";

const S3 = new AWS.S3();

export default {
    getObject: (params) => S3.getObject(params).promise()
};