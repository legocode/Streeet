import 'babel-polyfill';
import λ from 'apex.js';
import {decodeToken} from '../../lib/authorizer';
import {countByPostId, addComment, getByPostId, deleteComment} from '../../lib/comment_model';

export default λ((e, ctx) => {
  const postId = e.params.querystring.postId;
  const commentId = e.params.path.id;
  const httpMethod = e.context['http-method'];

  if(commentId) {
    if (httpMethod === "DELETE"){
      return deleteComment(id);
    }
  }
  if (postId) {
    if (httpMethod === "GET"){
      return {
        comments: getByPostId(postId),
        commentCount: countByPostId(postId)
      };
    }
  }
  const params = {
    token: e.params.header.Authorization,
    desc: e['body-json'].desc,
    postId: e['body-json'].postId
  };
  console.log("======", params);
  return addComment(params);
});
