import { combineReducers } from 'redux-immutable';
import user from './user';
import runtime from './runtime';
import gameplay from './gameplay';

export default combineReducers({
  user,
  runtime,
  gameplay,
});
