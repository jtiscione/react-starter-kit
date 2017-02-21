import fs from 'fs';
import Promise from 'bluebird';
import { Map } from 'immutable';
import 'babel-polyfill';
import path from 'path';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import socketIO from 'socket.io';
import notifier from 'node-notifier';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './core/passport';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import configureServerStore from './store/configureServerStore';
import serverListener from './subscribers/serverListener';
import { setRuntimeVariable } from './actions/runtime';
import { newGameAction } from './actions/gameplay';
import { bookFile, port, auth } from './config';
import pruneState from './store/pruneState';
import socketIoServerMiddlewareManager from './middleware/socketIoServerMiddlewareManager';

const uuid = require('uuid');

const manager = socketIoServerMiddlewareManager((type, action) => (action.meta && (action.meta.cc === 'client')));
const serverStore = configureServerStore(Map(), manager.middleware());
const readFile = Promise.promisify(fs.readFile);

async function readBook(fileName) {
  const book = await readFile(fileName, { encoding: 'utf8' })
    .then(JSON.parse);
  return book;
}

// eslint-disable-next-line global-require
const useDefaultBook = () => { serverStore.subscribe(serverListener(serverStore, require('../tiny_book'))); };

if (bookFile !== null) {
  readBook(bookFile).then((book) => {
    serverStore.subscribe(serverListener(serverStore, book));
    // console.log("LOADED BOOK: "+bookFile);
    notifier.notify(`LOADED BOOK ${bookFile}`);
  }).catch((err) => {
    console.error(err);  // eslint-disable-line no-console
    useDefaultBook();
  });
} else {
  // console.log("using default book...");
  useDefaultBook();
}

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

/*
let ping = 0;
setInterval(() => {
  ping++;
  io.emit("ping", { ping }
  )}, 1000);
*/

io.on('connection', (socket) => {
  socket.on('clientID', (clientID) => {
    manager.registerSocket(clientID, socket);
  });
  socket.on('error', (err) => {
    if (err) {
      console.error('Socket error', err); // eslint-disable-line no-console
    } else {
      console.error('Socket error.'); // eslint-disable-line no-console
    }
  });
});


//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(JSON.parse(JSON.stringify(req.user)), auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  let initialState = null;

  /*
  console.log("req.headers.cookie:"+req.headers.cookie);
  console.log("req.user: "+JSON.stringify(req.user));
  console.log("req.cookies: "+JSON.stringify(req.cookies));
  */

  let clientID = null;
  if (req.method === 'GET') {
    const cookie = req.cookies.clientID;
    if (cookie === undefined) {
      clientID = uuid.v1();
      res.cookie('clientID', clientID, { maxAge: 900000, httpOnly: true });
    } else {
      clientID = cookie;
    }
  }

  const clientState = pruneState(serverStore.getState(), clientID);

  if (clientState) {
    initialState = clientState;
  } else {
    initialState = Map();
  }

  initialState = initialState.set('user', req.user || null);

  try {
    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
    });

    store.dispatch(setRuntimeVariable({
      name: 'user',
      value: req.user ? JSON.parse(JSON.stringify(req.user)) : null,
    }));

    store.dispatch(setRuntimeVariable({
      name: 'clientID',
      value: clientID,
    }));

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    if (!clientState || clientState.getIn(['gameplay', clientID, 'defaultGame'])) {
      const action = newGameAction('pageload', clientID, 'defaultGame');
      serverStore.dispatch(action);
      store.dispatch(action);
    }

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Initialize a new Redux store
      // http://redux.js.org/docs/basics/UsageWithReact.html
      store,
    };

    const route = await UniversalRouter.resolve(routes, {
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    data.state = context.store.getState();
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  httpServer.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
