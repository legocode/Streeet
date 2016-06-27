import 'babel-polyfill';
import λ from 'apex.js';
import {register} from '../../lib/user_model';

export default λ((e, ctx) => {
  return register(e);
});
