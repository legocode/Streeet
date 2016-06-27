import 'babel-polyfill';
import λ from 'apex.js';
import {login} from '../../lib/user_model';

export default λ((e, ctx) => {
  if(!e.username || !e.password) return {"errorMessage": "username and password cannot be empty"}
  const params = {
    username: e.username,
    password: e.password
  };
  return login(params);
});
