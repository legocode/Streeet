import 'babel-polyfill';
import λ from 'apex.js';
import authorizer from '../../lib/authorizer';

export default λ((e, ctx) => {
  return authorizer(e, ctx);
});
