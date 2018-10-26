import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default async function (item, table) {
    const indexName = Object.keys(item)[0];
    const indexValue = Object.values(item)[0];
    const results = await dynamoDb.query({
        TableName: table,
        Select: 'ALL_ATTRIBUTES',
        IndexName: Object.keys(item)[0],
        KeyConditionExpression: `${indexName} = :hkey`,
        ExpressionAttributeValues: {
            ':hkey': indexValue
        }
    }).promise();

    return results.Items;
}
