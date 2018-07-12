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

#### `put(item, table)`

Performs an update to an existing DynamoDB record (if indices match) or creates a new record if an existing record is not found.

```js
import { dynamodb } from '@poddify/aws-common';

await dynamodb.put({
    id: 'some-id',
    hash: 'some-hashed-value'
}, DYNAMO_DB_TABLE);
```

#### `get(record, table)`

Gets a unique record that matches a given `index` : `value`

```js
import { dynamodb } from '@poddify/aws-common';

const value = await dynamodb.get({
    'my-index': indexValue
}, DYNAMO_DB_TABLE);
```
