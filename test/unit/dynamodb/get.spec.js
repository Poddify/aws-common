import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/dynamodb/get';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe('Feature: GET from DynamoDB', () => {
    it('Scenario: gets data from a DynamoDB table', async () => {
        const item = Symbol('data to retrieve');
        const table = Symbol('table to get data from');
        const expectedResults = Symbol('expected dynamo db entry');

        const getItemPromiseStub = sinon.stub().resolves(expectedResults);
        const getStub = sinon.stub().returns({
            promise: getItemPromiseStub
        });
        const dynamoMock = {
            get: getStub
        };

        const DocumentClient = sinon.stub().returns(dynamoMock);

        const get = loadModule({
            'aws-sdk': {
                DynamoDB: {
                    DocumentClient
                }
            }
        });

        const results = await get(item, table);

        expect(results).to.equal(expectedResults);
        expect(getStub.callCount, 'should call getItem').to.equal(1);
        expect(getItemPromiseStub.callCount, 'should call getItem(..).promise').to.equal(1);
        expect(getStub.firstCall.args).to.deep.equal([{
            TableName: table,
            Key: item
        }]);
    });
});
