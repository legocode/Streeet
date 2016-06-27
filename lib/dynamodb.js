import {DynamoDB} from 'aws-sdk';

const dynamoConfig = {
  sessionToken:    process.env.AWS_SESSION_TOKEN,
  region:          process.env.AWS_REGION
};

const client = new DynamoDB.DocumentClient(dynamoConfig);

export default (method, params) => {
  return new Promise((resolve, reject) => client[method](params, (err, data) => {
    if(err) reject(err);
    else resolve(data);
  }));
}
