import {KMS} from 'aws-sdk';

const awsConfig = {
  sessionToken:    process.env.AWS_SESSION_TOKEN,
  region:          process.env.AWS_REGION
};

const kms = new KMS(awsConfig);

export default (method, params) => {
  return new Promise((resolve, reject) => kms[method](params, (err, data) => {
    if(err) reject(err);
    else resolve(data);
  }));
}

