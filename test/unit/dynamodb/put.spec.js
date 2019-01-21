import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/dynamodb/put';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe('Feature: PUT from DynamoDB', () => {
    it('Scenario: puts data into a DynamoDB table', async () => {
        const item = Symbol('data to insert');
        const table = Symbol('table to put data into');
        const expectedResults = Symbol('expected dynamo db put results');

        const putItemPromiseStub = sinon.stub().resolves(expectedResults);
        const putStub = sinon.stub().returns({
            promise: putItemPromiseStub
        });
        const dynamoMock = {
            put: putStub
        };

        const getClientStub = sinon.stub().returns(dynamoMock);

        const put = loadModule({
            './client-factory': {
                get: getClientStub
            }
        });

        const results = await put(item, table);

        expect(results).to.equal(expectedResults);
        expect(putStub.callCount, 'should call putItem').to.equal(1);
        expect(putItemPromiseStub.callCount, 'should call putItem(..).promise').to.equal(1);
        expect(putStub.firstCall.args).to.deep.equal([{
            TableName: table,
            Item: item
        }]);
    });
});
