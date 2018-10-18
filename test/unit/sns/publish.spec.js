import AWS from 'aws-sdk';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

const MODULE = '../../../src/sns/publish';
const loadModule = stubs => proxyquire(MODULE, { ...stubs }).default;

describe.skip('Feature: publish to SNS topic', () => {
    afterEach(sinon.restore);

    it('Scenario: publishes data to an SNS topic', () => {
        const topic = Symbol('SNS Topic ARN');
        const subject = Symbol('Message subject');
        const message = Symbol('Message contents');

        const promisify = sinon.stub();
        const promisifiedPublish = sinon.stub();

        // FIXME:
        const SNS = sinon.createStubInstance(AWS.SNS);

        promisify.withArgs(SNS.publish).returns(promisifiedPublish);

        const publish = loadModule({
            '../util/promisify': promisify
        });

        publish(topic, subject, message);

        expect(promisifiedPublish.callCount).to.equal(1);
        expect(promisifiedPublish.firstCall.args).to.deep.equal({
            TopicArn: topic,
            Subject: subject,
            Message: message
        });
    });
});
