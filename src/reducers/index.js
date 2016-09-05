import { combineReducers } from 'redux';
import runtime from './runtime';
import gameplay from './gameplay';

export default combineReducers({
  runtime,
  gameplay,
});
