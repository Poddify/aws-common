import doc from 'dynamodb-doc';
import promisify from '../util/promisify';

const dynamoDb = new doc.DynamoDB();

export default (item, table) =>
    promisify(dynamoDb.putItem)({
        TableName: table,
        Item: item
    });
