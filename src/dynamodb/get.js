import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default async function (item, table) {
    const results = await dynamoDb.get({
        TableName: table,
        Key: item
    }).promise();

    return results.Item;
}
