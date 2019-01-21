import { get as getDynamoClient } from './client-factory';

export default async function (item, table, config = {}) {
    const dynamoDb = getDynamoClient(config);
    const results = await dynamoDb.get({
        TableName: table,
        Key: item
    }).promise();

    return results.Item;
}
