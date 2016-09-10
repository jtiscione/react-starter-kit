import { combineReducers } from 'redux-immutable';
import runtime from './runtime';
import gameplay from './gameplay';

export default combineReducers({
  runtime,
  gameplay,
});
