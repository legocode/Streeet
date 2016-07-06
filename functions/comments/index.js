import 'babel-polyfill';
import λ from 'apex.js';
import {decodeToken} from '../../lib/authorizer';
import {countByPostId, addComment, getByPostId, deleteComment} from '../../lib/comment_model';

export default λ((e, ctx) => {
  let postId = e.params.querystring.postId;
  const commentId = e.params.path.id;
  const httpMethod = e.context['http-method'];

  if(commentId) {
    if (httpMethod === "DELETE"){
      postId = e['body-json'].postId;
      const createdAt = e['body-json'].createdAt;
      return deleteComment(commentId, postId, Number(createdAt));
    }
  }
  if (postId) {
    if (httpMethod === "GET"){
      return showComment(postId);
    }
  }
  const params = {
    token: e.params.header.Authorization,
    desc: e['body-json'].desc,
    postId: e['body-json'].postId
  };
  return addComment(params);
});

const showComment = async postId => {
  return {
    comments: await getByPostId(postId),
    commentCount: await countByPostId(postId)
  };
};
