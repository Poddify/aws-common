import AWS from 'aws-sdk';

function getRegion(config) {
    if (config.region) {
        return config.region;
    } else if (process.env.AWS_REGION) {
        return process.env.AWS_REGION;
    }

    return 'us-east-1'; // default to N.Virginia
}

function getEndpoint(config) {
    if (config.endpoint) {
        return config.endpoint;
    } else if (process.env.AWS_DYNAMODB_ENDPOINT) {
        return process.env.AWS_DYNAMODB_ENDPOINT;
    }

    return undefined;
}

function getSecretAccessKey(config) {
    if (config.secretAccessKey) {
        return config.secretAccessKey;
    } else if (process.env.AWS_SECRET_ACCESS_KEY) {
        return process.env.AWS_SECRET_ACCESS_KEY;
    }

    return undefined;
}

function getAccessKeyId(config) {
    if (config.accessKeyId) {
        return config.accessKeyId;
    } else if (process.env.AWS_ACCESS_KEY_ID) {
        return process.env.AWS_ACCESS_KEY_ID;
    }

    return undefined;
}

export function get(config = {}) {
    return new AWS.DynamoDB.DocumentClient({
        region: getRegion(config),
        endpoint: getEndpoint(config),
        accessKeyId: getAccessKeyId(config),
        secretAccessKey: getSecretAccessKey(config)
    });
}
