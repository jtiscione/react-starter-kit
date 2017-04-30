export default function createSocketIoMiddleware(socket, criteria = [], { eventName = 'action', _execute } = {}) {
  // eslint-disable-next-line no-unused-vars
  const execute = _execute || ((action, emit, next, dispatch) => {
    emit(eventName, action);
    next(action);
  });

  const emitBound = socket.emit.bind(socket);

  function evaluate(action, option) {
    const { type } = action;
    let matched = false;
    if (typeof option === 'function') {
      // Test function
      matched = option(type, action);
    } else if (typeof option === 'string') {
      // String prefix
      matched = type.indexOf(option) === 0;
    } else if (Array.isArray(option)) {
      // Array of types
      matched = option.some(item => type.indexOf(item) === 0);
    }
    return matched;
  }

  return ({ dispatch }) => {
    // Wire socket.io to dispatch actions sent by the server.
    socket.on(eventName, dispatch);
    return next => (action) => {
      if (evaluate(action, criteria)) {
        execute(action, emitBound, next, dispatch);
      } else {
        next(action);
      }
    };
  };
}
