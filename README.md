<p align="center">
:warning: This dependency is deprecated :warning:
</p>

Using AWS SDKs directly isn't that difficult, and adding another layer of abstraction is unnecessary. This hasn't been updated in years, so 🤷‍♀️ if you _really_ want this, feel free to fork. 

# @poddify/aws-common

Utilities for interacting with AWS resources

This module seeks to simplify your interactions with AWS resources by providing simpler interfaces than your standard `aws-sdk` consumption.

## Supported Resources

This module is always evolving to add and enhance support. Pull requests are welcome.

* SNS
* DynamoDB
* ...more coming soon!

## Installation

```
$ npm i --save @poddify/aws-common
```

## Usage

### SNS

#### `publish(topic, subject, message)`

Publish an event to an SNS topic

```js
await sns.publish(TOPIC_ARN, 'some subject', 'a message');
```

### DynamoDB

All DynamoDB methods expose an optional `config` parameter. This `config` parameter maps directly to the AWS DynamoDB configuration document by the parent SDK:

```js
const config = {
    region: 'us-east-1',
    endpoint: 'http://localhost:8000' // for local development
    accessKeyId: 'Keep this secret',
    secretAccessKey: 'DEFINITELY keep this secret'
};
```

#### `put(item, table, config)`

Performs an update to an existing DynamoDB record (if indices match) or creates a new record if an existing record is not found.

```js
import { dynamodb } from '@poddify/aws-common';

await dynamodb.put({
    id: 'some-id',
    hash: 'some-hashed-value'
}, DYNAMO_DB_TABLE);
```

#### `get(record, table, config)`

Gets a unique record that matches a given `index` : `value` on the default index

```js
import { dynamodb } from '@poddify/aws-common';

const value = await dynamodb.get({
    'my-index': indexValue
}, DYNAMO_DB_TABLE);
```

### `query(index, query, table, config)`

Gets a set of records that match the `query` object when compared against a specific Index

```js
import { dynamodb } from '@poddify/aws-common';

const results = await dynamodb.query('myIndex', {
    hashKey: hashValue,
    sortKey: sortValue
}, DYNAMO_DB_TABLE)
```
