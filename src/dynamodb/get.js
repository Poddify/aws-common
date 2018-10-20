import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default (item, table) =>
    dynamoDb.get({
        TableName: table,
        Key: item
    }).promise();
