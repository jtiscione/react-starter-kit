import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { setRuntimeVariable } from '../actions/runtime';
import createLogger from './logger';

export default function configureServerStore(initialState) {

  const helpers = {}; // put stuff in later
  const middleware = [thunk.withExtraArgument(helpers)];

  if (__DEV__) {
    middleware.push(createLogger());
  }
  const enhancer = compose(
    applyMiddleware(...middleware)
  );

  const store = createStore(rootReducer, initialState, enhancer);

  /*
  // probably not needed
  store.dispatch(setRuntimeVariable({
    name: 'initialNow',
    value: Date.now(),
  }));
   */

  if(__DEV__ && module.hot) {
    module.hot.accept('../reducers/server', () =>
      store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
    );
  }

  return store;
}
