import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB();

export default (item, table) =>
    dynamoDb.putItem({
        TableName: table,
        Item: item
    }).promise();
