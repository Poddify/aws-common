import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import Chance from 'chance';

const chance = new Chance();
const MODULE = '../../../src/dynamodb/query';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe('Feature: Query data from DynamoDB', () => {
    it('Scenario: gets data from a DynamoDB table', async () => {
        const tableName = chance.string();
        const queryKey1 = chance.string();
        const queryKey2 = chance.string();
        const indexName = chance.string();
        const queryValue1 = Symbol('value to query on');
        const queryValue2 = Symbol('value to query on');
        const expectedResults = Symbol('expected dynamo db query results');
        const queryData = {
            [queryKey1]: queryValue1,
            [queryKey2]: queryValue2
        };

        const queryPromiseStub = sinon.stub().resolves({
            Items: expectedResults
        });
        const queryStub = sinon.stub().returns({
            promise: queryPromiseStub
        });
        const dynamoMock = {
            query: queryStub
        };

        const DocumentClient = sinon.stub().returns(dynamoMock);

        const query = loadModule({
            'aws-sdk': {
                DynamoDB: {
                    DocumentClient
                }
            }
        });

        const results = await query(indexName, queryData, tableName);

        expect(results).to.equal(expectedResults);
        expect(queryStub.callCount, 'should call batchGet').to.equal(1);
        expect(queryPromiseStub.callCount, 'should call batchGet(..).promise').to.equal(1);
        expect(queryStub.firstCall.args).to.deep.equal([{
            TableName: tableName,
            Select: 'ALL_ATTRIBUTES',
            IndexName: indexName,
            KeyConditionExpression: `${queryKey1} = :${queryKey1} and ${queryKey2} = :${queryKey2}`,
            ExpressionAttributeValues: {
                [`:${queryKey1}`]: queryValue1,
                [`:${queryKey2}`]: queryValue2
            }
        }]);
    });
});
