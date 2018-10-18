import doc from 'dynamodb-doc';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/dynamodb/put';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe.skip('Feature: PUT to DynamoDB', () => {
    afterEach(sinon.restore);

    it('Scenario: puts data to a DynamoDB table', () => {
        const item = Symbol('data to put');
        const table = Symbol('table to put data into');

        const promisify = sinon.stub();
        const promisifiedPut = sinon.stub();

        // FIXME:
        const dynamoDb = sinon.createStubInstance(doc.DynamoDB);

        promisify.withArgs(dynamoDb.putItem).returns(promisifiedPut);

        const put = loadModule({
            '../util/promisify': promisify
        });

        put(item, table);

        expect(promisifiedPut.callCount).to.equal(1);
        expect(promisifiedPut.firstCall.args).to.deep.equal({
            TableName: table,
            Item: item
        });
    });
});
