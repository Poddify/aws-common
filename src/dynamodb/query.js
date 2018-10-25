import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default (item, table) =>
    dynamoDb.batchGet({
        RequestItems: {
            [table]: {
                Keys: [item]
            }
        }
    }).promise();
