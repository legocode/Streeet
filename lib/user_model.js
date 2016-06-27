import db from './dynamodb';
import {usersTable, MK} from './consts';
import bcryptjs from 'bcryptjs';
import kms from './kms';
import njwt from 'njwt';
import uuid from 'uuid';

export async function getAll() {
  const reply = await db('scan', {
    TableName: usersTable,
    AttributesToGet: [
      'id',
      'username',
      'name',
      'email'
    ]
  });
  return reply.Items;
}

export const login = async params => {
  // Grab the value form the params
  const username = params.username;
  const password = params.password;
  // Get the user information  
  let reply = await db('get', {
      TableName: usersTable,
      Key: {username},
      AttributesToGet: [
        'id',
        'name',
        'username',
        'email',
        'permissions',
        'password_hash',
        'signing_key'
      ]
  });
  // Check the wrong cases
  let Item = reply.Item;  
  if (!Item) return 'User not found';
  let match = bcryptjs.compareSync(password, Item.password_hash);
  if (!match) return 'Invalid password';
  
  // Generate the user token default expire period is 1 hour
  const claims = {
    iss: "awsrun.com",
    sub: Item.id,
    scope: "user",
    userInfo: {
      name: Item.name,
      username: Item.username,
      email: Item.email,
      permissions: Item.permissions
    }
  };
  const jwt = njwt.create(claims, Item.password_hash);
  // Assigning the token for the user
  Item.token = jwt.compact() + "|" + Item.signing_key;
  
  delete Item.password_hash;
  delete Item.signing_key;

  return Item;
}

// The register user api
export const register = async form => {
  // Validate the register form 
  if (!form || !form.name || !form.username || !form.email || !form.password) {
    return "The form information is invalid"
  }
  // Check if the user is exists
  const exists = await db('get', {
    TableName: usersTable,
    Key: {username: form.username}
  });
  if (exists.Item) return 'username is exists';
  // Generate the id for the user
  const uid = uuid.v4();
  // Hash the plain password
  const password_hash = bcryptjs.hashSync(form.password, bcryptjs.genSaltSync(10));
  // Generate the Signning Key from KMS master key
  let encryptData = await kms('encrypt', {
    KeyId: MK,
    Plaintext: password_hash
  });
  // Assign the signing key in base64 format and then store it to the db
  const signingKey = new Buffer(encryptData.CiphertextBlob).toString('base64');

  const result = await db('put', {
    TableName: usersTable,
    Item: {
      id: uid,
      name: form.name,
      username: form.username,
      password_hash: password_hash,
      email: form.email,
      permissions: 'user',
      signing_key: signingKey
    }
  });
  if(result) return 'successfully';
  else return 'failed';
}

