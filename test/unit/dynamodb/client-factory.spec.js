import sinon from 'sinon';
import { expect } from 'chai';
import AWS from 'aws-sdk';
import Chance from 'chance';
import { get as getDocumentClient } from '../../../src/dynamodb/client-factory';

const chance = new Chance();

describe('Feature: AWS DynamoDB Document Client Factory', () => {
    let documentClientStub,
        client,
        expectedClient,
        awsSdkStub;

    afterEach(() => {
        awsSdkStub.restore();
    });

    beforeEach(() => {
        expectedClient = Symbol('configured DynamoDB.DocumentClient');
        documentClientStub = sinon.stub().returns(expectedClient);

        class DocumentClient {
            constructor(...args) {
                documentClientStub(...args);
            }
        }

        awsSdkStub = sinon.stub(AWS.DynamoDB, 'DocumentClient').value(DocumentClient);
    });

    describe('Default config', () => {
        beforeEach(() => {
            delete process.env.AWS_REGION;
            delete process.env.AWS_DYNAMODB_ENDPOINT;
            delete process.env.AWS_SECRET_ACCESS_KEY;
            delete process.env.AWS_ACCESS_KEY_ID;

            client = getDocumentClient();
        });

        it('should return a new document client', () => {
            expect(client.constructor.name).to.equal(AWS.DynamoDB.DocumentClient.name);
        });

        it('should configure the new document client', () => {
            expect(documentClientStub.callCount).to.equal(1);
            expect(documentClientStub.firstCall.args).to.deep.equal([{
                region: 'us-east-1',
                endpoint: undefined,
                accessKeyId: undefined,
                secretAccessKey: undefined
            }]);
        });
    });

    describe('Custom config', () => {
        let secretAccessKey,
            accessKeyId,
            endpoint,
            region;

        beforeEach(() => {
            endpoint = Symbol('endpoint');
            region = Symbol('region');
            accessKeyId = Symbol('accessKeyId');
            secretAccessKey = Symbol('secretAccessKey');

            client = getDocumentClient({
                endpoint,
                region,
                accessKeyId,
                secretAccessKey
            });
        });

        it('should return a new document client', () => {
            expect(client.constructor.name).to.equal(AWS.DynamoDB.DocumentClient.name);
        });

        it('should configure the new document client', () => {
            expect(documentClientStub.callCount).to.equal(1);
            expect(documentClientStub.firstCall.args).to.deep.equal([{
                region,
                endpoint,
                accessKeyId,
                secretAccessKey
            }]);
        });
    });

    describe('process.env fallback', () => {
        let secretAccessKey,
            accessKeyId,
            endpoint,
            region;

        beforeEach(() => {
            secretAccessKey = chance.string();
            accessKeyId = chance.string();
            endpoint = chance.url();
            region = chance.string();

            process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
            process.env.AWS_ACCESS_KEY_ID = accessKeyId;
            process.env.AWS_REGION = region;
            process.env.AWS_DYNAMODB_ENDPOINT = endpoint;

            client = getDocumentClient();
        });

        it('should return a new document client', () => {
            expect(client.constructor.name).to.equal(AWS.DynamoDB.DocumentClient.name);
        });

        it('should configure the new document client', () => {
            expect(documentClientStub.callCount).to.equal(1);
            expect(documentClientStub.firstCall.args).to.deep.equal([{
                region,
                endpoint,
                accessKeyId,
                secretAccessKey
            }]);
        });
    });
});
