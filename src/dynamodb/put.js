import doc from 'dynamodb-doc';

const dynamoDb = new doc.DynamoDB();

export default (item, table) =>
    dynamoDb.putItem({
        TableName: table,
        Item: item
    }).promise();
