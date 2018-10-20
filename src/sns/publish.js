import AWS from 'aws-sdk';

const SNS = new AWS.SNS();

export default (topic, subject, message) =>
    SNS.publish({
        TopicArn: topic,
        Subject: subject,
        Message: message
    }).promise();
