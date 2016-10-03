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
        for (let [clientID, _socket] of clientSockets.entries()) {
          if (_socket === socket) {
            clientSockets.delete(clientID);
            return;
          }
        }
      });
    },

    middleware: () => {
      return (store) => {
        if (!dispatch) {
          // Get hold of it...
          dispatch = store.dispatch;
          for (let socket of clientSockets.values()) {
            // Wire socket.io to dispatch events sent by the client
            socket.on(eventName, dispatch);
          }
        }
        return next => action => {
          const { type, clientID } = action;
          if ( type ) {
            if (testFunction(type, action)) {
              if (clientSockets.has(clientID)) {
                clientSockets.get(clientID, socket).emit(action);
              }
            }
          }
          return next(action);
        }
      }
    }
  }
}
