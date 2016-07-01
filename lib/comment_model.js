import db from './dynamodb';
import {commentsTable} from './consts';
import {decodeToken} from './authorizer';
import {updateCommentCount} from './post_model';
import uuid from 'uuid';

export async function getByPostId(postId) {

  const reply = await db('query', {
    TableName: commentsTable,
    KeyConditionExpression: "post_id = :post_id and created_at < :rightNow",
    ExpressionAttributeValues: {
      ':post_id': postId,
      ':rightNow': Date.now()
    },
    ScanIndexForward: false,
    Limit: 20
  });
  return reply.Items;
}

export const addComment = async params => {
  const claims = await decodeToken(params.token);
  const userInfo = claims.body.userInfo;
  const postId = params.postId;
  let result = await db('put', {
    TableName: commentsTable,
    Item: {
      id: uuid.v4(),
      username: userInfo.username,
      created_at: Date.now(),
      post_id: postId,
      desc: params.desc
    }
  });
  if(result) {
    const commentCount = await countByPostId(postId);
    result = await updateCommentCount(postId, commentCount);
  }
  if(result) return 'successfully';
  else return 'failed';
};

export const countByPostId = async postId => {
  const reply = await db('query', {
    TableName: commentsTable,
    KeyConditionExpression: "post_id = :post_id",
    ExpressionAttributeValues: {
      ':post_id': postId
    },
    Select: 'COUNT'
  });
  return reply.Count;
};

export const deleteComment = async id => {
  const result = await db('delete', {
    TableName: commentsTable,
    Key: {id}
  });
  if(result) return 'successfully';
  else return 'failed';
};
