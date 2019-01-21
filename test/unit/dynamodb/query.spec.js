import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import Chance from 'chance';

const chance = new Chance();
const MODULE = '../../../src/dynamodb/query';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe('Feature: Query data from DynamoDB', () => {
    let query,
        getClient,
        queryStub,
        queryPromiseStub,
        tableName,
        queryKey1,
        queryKey2,
        queryData,
        indexName,
        queryValue1,
        queryValue2,
        expectedResults;

    beforeEach(() => {
        tableName = chance.string();
        queryKey1 = chance.string();
        queryKey2 = chance.string();
        indexName = chance.string();
        queryValue1 = Symbol('value to query on');
        queryValue2 = Symbol('value to query on');
        expectedResults = Symbol('expected dynamo db query results');

        queryData = {
            [queryKey1]: queryValue1,
            [queryKey2]: queryValue2
        };

        queryPromiseStub = sinon.stub().resolves({
            Items: expectedResults
        });
        queryStub = sinon.stub().returns({
            promise: queryPromiseStub
        });

        const dynamoMock = {
            query: queryStub
        };

        getClient = sinon.stub().returns(dynamoMock);

        query = loadModule({
            './client-factory': {
                get: getClient
            }
        });
    });

    describe('default config', () => {
        let results;

        beforeEach(async () => {
            results = await query(indexName, queryData, tableName);
        });

        it('Scenario: gets data from a DynamoDB table', () => {
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

    describe('custom config', () => {
        let config;

        beforeEach(async () => {
            config = Symbol('custom dynamodb config');

            await query(indexName, queryData, tableName, config);
        });

        it('gets the DynamoDB client with the default configuration', () => {
            expect(getClient.callCount).to.equal(1);
            expect(getClient.firstCall.args).to.deep.equal([config]);
        });
    });
});
