import 'babel-polyfill';
import λ from 'apex.js';
import {decodeToken} from '../../lib/authorizer';

export default λ((e, ctx) => {
  const postId = e.params.path.id;
  const httpMethod = e.context['http-method'];
  if (!postId)
    return index(e);
  if (postId) {
    if (httpMethod === "GET") 
      return getById(e, postId);
    if (httpMethod === "POST")
      return postById(e, postId);
  }
});

const index = async e => {
  try {
    const claims = await decodeToken(e.params.header.Authorization);
    const userInfo = claims.body.userInfo;
    return {
      e,
      claims,
      userInfo
    };
  } catch (ex) {
    throw new Error({"errorMessage": ex})
  }
}

const getById = async (e, id) => {
  const claims = await decodeToken(e.params.header.Authorization);
  const userInfo = claims.body.userInfo;
  return {post_id: id, method: e.context['http-method'], userInfo};
}

const postById = async (e, id) => {
  const claims = await decodeToken(e.params.header.Authorization);
  const userInfo = claims.body.userInfo;
  return {post_id: id, method: e.context['http-method'], userInfo};
}
