import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB();

export default (item, table) =>
    dynamoDb.getItem({
        TableName: table,
        Key: item
    }).promise();
