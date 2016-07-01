import kms from './kms';
import njwt from 'njwt';
import {AuthPolicy} from './auth_policy';

// The authorization api for invoking api calls
export default async params => {
  // Grab the values from params
  let token = params.authorizationToken;
  const methodArn = params.methodArn;

  // Validate the values are not empty
  if(!token || !methodArn) {
    return 'invalid params';
  }

  try {
    if(token.indexOf('|') === -1) throw new Error("Unauthorized");
    // Parse the methodArn
    const {apiOptions, awsAccountId} = arnParser(methodArn);
    // Decode the token
    const verifiedJwt = await decodeToken(token);
    // Generate the policy
    const policy = new AuthPolicy(verifiedJwt.body.sub, awsAccountId, apiOptions);
    if (verifiedJwt.body.scope.indexOf("user") === -1) throw new Error('Unauthorized');
    policy.allowAllMethods();
    const policyBuild = policy.build();
    console.log(policyBuild);
    console.log("statement: ", policyBuild.policyDocument.Statement);
    return policyBuild;
  } catch(ex) {
    console.log(ex);
    throw new Error("Unauthorized");
  }
}

export const arnParser = methodArn => {
  const apiOptions = {};
  const tmp = methodArn.split(':');
  const apiGatewayArnTmp = tmp[5].split('/');
  const awsAccountId = tmp[4];
  apiOptions.region = tmp[3];
  apiOptions.restApiId = apiGatewayArnTmp[0];
  apiOptions.stage = apiGatewayArnTmp[1];
  return {apiOptions, awsAccountId};
}

export const decodeToken = async token => {
  const signingKey = token.split('|')[1];
  const jwtToken = token.split('|')[0];

  // Decrypt the signingKey
  const decryptionParams = {
    CiphertextBlob : new Buffer(signingKey, 'base64')
  }
  const decryptRes = await kms('decrypt', decryptionParams);
  const key = await decryptRes.Plaintext;
  // Fetch the verified jwt object
  const verifiedJwt = njwt.verify(jwtToken, key);
  return verifiedJwt;
}

