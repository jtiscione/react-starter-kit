/**
 * Created by jason on 10/1/16.
 * Analogous to socketIoMiddleware which is used on the client.
 * This one is different because it needs to track multiple sockets.
 */
export default function socketIoServerMiddlewareManager(testFunction, { eventName = 'action' } = {}) {
  let dispatch = null;

  const clientSockets = new Map();

  return {

    registerSocket: (clientID, socket) => {
      clientSockets.set(clientID, socket);

      // Wire socket.io to dispatch actions sent by the client.
      if (dispatch) {
        socket.on(eventName, dispatch);
      }

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [_clientID, _socket] of clientSockets.entries()) {
          if (_socket === socket) {
            clientSockets.delete(_clientID);
            return;
          }
        }
      });
    },

    middleware: () => (store) => {
      if (!dispatch) {
        // Get hold of it...
        dispatch = store.dispatch;
        // eslint-disable-next-line no-restricted-syntax
        for (const socket of clientSockets.values()) {
          // Wire socket.io to dispatch events sent by the client
          socket.on(eventName, dispatch);
        }
      }
      return next => (action) => {
        const { type, payload } = action;
        if (type && payload) {
          if (testFunction(type, action)) {
            if (clientSockets.has(payload.clientID)) {
              clientSockets.get(payload.clientID).emit('action', action);
            }
          }
        }
        return next(action);
      };
    },
  };
}
