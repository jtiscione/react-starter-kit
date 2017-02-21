import { fromJS } from 'immutable';

export default function (state, clientID) {
  const jsState = state.toJS();

  let foundFlag = false;

  function prune(object, _clientID) {
    if (Array.isArray(object)) {
      for (const element of object) {  // eslint-disable-line no-restricted-syntax
        prune(element, _clientID);
      }
      return;
    }
    if (typeof object === 'object') {
      let found = false;
      for (const field in object) { // eslint-disable-line no-restricted-syntax
        if (field === _clientID) {
          found = true;
          foundFlag = true;
        }
      }
      for (const field in object) { // eslint-disable-line no-restricted-syntax
        if (found) {
          if (field !== _clientID) {
            delete object[field];  // eslint-disable-line no-param-reassign
            continue;  // eslint-disable-line no-continue
          }
        }
        prune(object[field], _clientID);
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
