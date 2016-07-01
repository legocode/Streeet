import db from './dynamodb';
import {postsTable} from './consts';
import {decodeToken} from './authorizer';
import njwt from 'njwt';
import uuid from 'uuid';

export async function getAll() {

  const reply = await db('query', {
    TableName: postsTable,
    KeyConditionExpression: "username = :username and created_at < :rightNow",
    ExpressionAttributeValues: {
      ':username': 'leon',
      ':rightNow': Date.now()
    },
    ScanIndexForward: false,
    Limit: 20
  });
  return reply.Items;
}

export async function getById(id) {
  const reply = await db('get', {
    TableName: postsTable,
    Key: {id},
    AttributesToGet: [
      'id',
      'username',
      'created_at',
      'image_url',
      'desc',
      'comment_count'
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
      username: userInfo.username,
      created_at: Date.now(),
      image_url: params.imageURL,
      desc: params.desc,
      comment_count: 0
    }
  });
  if(result) return 'successfully';
  else return 'failed';
};

export const updateCommentCount = async (postId, commentCount) => {
  let post = await getById(postId);
  post.comment_count = commentCount;
  return await db('put', {
    TableName: postsTable,
    Item: post
  });
};
