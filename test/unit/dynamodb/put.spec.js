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
        const putItemStub = sinon.stub().returns({
            promise: putItemPromiseStub
        });
        const dynamoMock = {
            putItem: putItemStub
        };

        const DynamoDB = sinon.stub().returns(dynamoMock);

        const put = loadModule({
            'dynamodb-doc': {
                DynamoDB
            }
        });

        const results = await put(item, table);

        expect(results).to.equal(expectedResults);
        expect(putItemStub.callCount, 'should call putItem').to.equal(1);
        expect(putItemPromiseStub.callCount, 'should call putItem(..).promise').to.equal(1);
        expect(putItemStub.firstCall.args).to.deep.equal([{
            TableName: table,
            Item: item
        }]);
    });
});
