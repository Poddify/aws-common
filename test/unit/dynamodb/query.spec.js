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
        const queryData = Symbol('data to query against');
        const expectedResults = Symbol('expected dynamo db put results');

        const batchGetPromiseStub = sinon.stub().resolves(expectedResults);
        const batchGetStub = sinon.stub().returns({
            promise: batchGetPromiseStub
        });
        const dynamoMock = {
            batchGet: batchGetStub
        };

        const DocumentClient = sinon.stub().returns(dynamoMock);

        const query = loadModule({
            'aws-sdk': {
                DynamoDB: {
                    DocumentClient
                }
            }
        });

        const results = await query(queryData, tableName);

        expect(results).to.equal(expectedResults);
        expect(batchGetStub.callCount, 'should call batchGet').to.equal(1);
        expect(batchGetPromiseStub.callCount, 'should call batchGet(..).promise').to.equal(1);
        expect(batchGetStub.firstCall.args).to.deep.equal([{
            RequestItems: {
                [tableName]: {
                    Keys: [queryData]
                }
            }
        }]);
    });
});
