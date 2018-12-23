import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function getKeyConditionExpression(item) {
    return Object.keys(item)
                 .map(key => `${key} = :${key}`)
                 .join(' and ');
}

function getExpressionAttributeValues(item) {
    return Object.entries(item)
                 .reduce((memo, [key, value]) => ({
                     ...memo,
                     [`:${key}`]: value
                 }), {});
}

export default async function (indexName, item, table) {
    const results = await dynamoDb.query({
        TableName: table,
        Select: 'ALL_ATTRIBUTES',
        IndexName: indexName,
        KeyConditionExpression: getKeyConditionExpression(item),
        ExpressionAttributeValues: getExpressionAttributeValues(item)
    }).promise();

    return results.Items;
}
