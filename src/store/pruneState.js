/**
 * Created by jason on 9/30/16.
 */
import {fromJS, Map} from 'immutable';

export default function(state, clientID) {

  const jsState = state.toJS();

  let foundFlag = false;

  function prune(object, clientID) {
    if (typeof object === 'array') {
      for (let element of object) {
        prune(element, clientID);
      }
      return;
    }
    if (typeof object === 'object') {
      let found = false;
      for (let field in object) {
        if (field == clientID) {
          found = true;
          foundFlag = true;
        }
      }
      for (let field in object) {
        if (found) {
          if (field != clientID) {
            delete object[field];
            continue;
          }
        }
        prune(object[field], clientID);
      }
    }
  }

  prune(jsState, clientID);

  // FOR NOW
  if (!foundFlag) {
    return null;
  }
  return fromJS(jsState);

}
