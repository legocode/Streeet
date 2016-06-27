import 'babel-polyfill';
import λ from 'apex.js';
import {getAll} from '../../lib/user_model';

export default λ((e, ctx) => {
  return getAll();
});
