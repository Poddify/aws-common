import AWS from 'aws-sdk';
import promisify from '../util/promisify';

const SNS = new AWS.SNS();

export default (topic, subject, message) =>
    promisify(SNS.publish)({
        TopicArn: topic,
        Subject: subject,
        Message: message
    });
