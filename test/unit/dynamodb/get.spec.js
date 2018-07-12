import doc from 'dynamodb-doc';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/dynamodb/get';
const loadModule = stubs => proxyquire(MODULE, {...stubs}).default;

describe('Feature: GET from DynamoDB', () => {
    afterEach(sinon.restore);

    it('Scenario: gets data from a DynamoDB table', () => {
        const item = Symbol('data to retrieve');
        const table = Symbol('table to get data from');

        const promisify = sinon.stub();
        const promisifiedGet = sinon.stub();

        // FIXME:
        const dynamoDb = sinon.createStubInstance(doc.DynamoDB);

        promisify.withArgs(dynamoDb.getItem).returns(promisifiedGet);

        const get = loadModule({
            '../util/promisify': promisify
        });

        get(item, table);

        expect(promisifiedGet.callCount).to.equal(1);
        expect(promisifiedGet.firstCall.args).to.deep.equal({
            TableName: table,
            Key: item
        });
    });
});
