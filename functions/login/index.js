import 'babel-polyfill';
import λ from 'apex.js';
import {login} from '../../lib/user_model';

export default λ((e, ctx) => {
  if(!e['body-json'].username || !e['body-json'].password) return {"errorMessage": "username and password cannot be empty!"}
  const params = {
    username: e['body-json'].username,
    password: e['body-json'].password
  };
  return login(params);
});
