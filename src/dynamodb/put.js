import { get as getDynamoClient } from './client-factory';

export default (item, table, config) => {
    const dynamoDb = getDynamoClient(config);

    return dynamoDb.put({
        TableName: table,
        Item: item
    }).promise();
};
