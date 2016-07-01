import 'babel-polyfill';
import λ from 'apex.js';
import {decodeToken} from '../../lib/authorizer';
import {getAll, getById, addPost} from '../../lib/post_model';

export default λ((e, ctx) => {
  const postId = e.params.path.id;
  const httpMethod = e.context['http-method'];

  if (!postId) {
    if (httpMethod === "GET"){
      return getAll();
    }
    if (httpMethod === "POST") {
      const params = {
        token: e.params.header.Authorization,
        imageURL: e['body-json'].imageURL,
        desc: e['body-json'].desc
      };
      return addPost(params);
    }

  }

  if (postId) {
      return getById(postId);
  }
});
