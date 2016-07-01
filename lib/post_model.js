import db from './dynamodb';
import {postsTable} from './consts';
import {decodeToken} from './authorizer';
import njwt from 'njwt';
import uuid from 'uuid';

export async function getAll() {
  const reply = await db('scan', {
    TableName: postsTable,
    AttributesToGet: [
      'id',
      'imageURL',
      'desc',
      'commentCount',
      'postUser'
    ]
  });
  return reply.Items;


  // const params = {
  //   TableName: postsTable,
  //   KeyConditionExpression: 'id > :id',
  //   ScanIndexForward: false,
  //   ExpressionAttributeValues: {
  //     ':id': '0'
  //   }
  // };
  // const reply = await db('query', params);
  // return reply.Items;
}

export async function getById(id) {
  const reply = await db('get', {
    TableName: postsTable,
    Key: {id},
    AttributesToGet: [
      'id',
      'imageURL',
      'desc',
      'commentCount',
      'postUser'
    ]
  });
  return reply.Item;
}

export const addPost = async params => {
  const claims = await decodeToken(params.token);
  const userInfo = claims.body.userInfo;
  const result = await db('put', {
    TableName: postsTable,
    Item: {
      id: uuid.v4(),
      imageURL: params.imageURL,
      desc: params.desc,
      postUser: userInfo.username,
      commentCount: 0
    }
  });
  if(result) return 'successfully';
  else return 'failed';
};
