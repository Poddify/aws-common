import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/sns/publish';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe('Feature: Publish to SNS topic', () => {
    it('Scenario: publish a message + subject to an SNS topic', async () => {
        const topic = Symbol('SNS Topic ARN');
        const subject = Symbol('Message subject');
        const message = Symbol('Message contents');

        const expectedResults = Symbol('expected dynamo db entry');

        const publishPromiseStub = sinon.stub().resolves(expectedResults);
        const publishStub = sinon.stub().returns({
            promise: publishPromiseStub
        });
        const snsMock = {
            publish: publishStub
        };

        const SNS = sinon.stub().returns(snsMock);

        const publish = loadModule({
            'aws-sdk': {
                SNS
            }
        });

        const results = await publish(topic, subject, message);

        expect(results).to.equal(expectedResults);
        expect(publishStub.callCount, 'should call sns.publish').to.equal(1);
        expect(publishPromiseStub.callCount, 'should call sns.publish(..).promise').to.equal(1);
        expect(publishStub.firstCall.args).to.deep.equal([{
            TopicArn: topic,
            Subject: subject,
            Message: message
        }]);
    });
});
