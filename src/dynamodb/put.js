import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default (item, table) =>
    dynamoDb.put({
        TableName: table,
        Item: item
    }).promise();
