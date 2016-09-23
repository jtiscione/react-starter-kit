/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './core/passport';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import createHistory from './core/createHistory';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import configureServerStore from './store/configureServerStore';
import { setRuntimeVariable } from './actions/runtime';
import { port, wsport, auth } from './config';
import { fromJS, Map } from 'immutable';
const uuid = require('uuid');

import socketIO from 'socket.io';

const serverStore = configureServerStore(Map());

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

serverStore.subscribe(
  // fix later
  () => {
    console.log('emitting state:');
    io.emit('state', serverStore.getState().toJS());
  }
);

let ping = 0;
setInterval(() => {
  ping++;
  console.log("emitting ping: "+ ping);
  io.emit("ping", { ping }
  )}, 1000);

io.on('connection', function(socket){

  console.log("Socket connected: "+socket.id);

  socket.emit('state', serverStore.getState().toJS());
  console.log('a user connected');

  socket.on('action', (action) => {
    console.log("io on action: "+JSON.stringify(action));
  }); //serverStore.dispatch.bind(serverStore));

  socket.on('disconnect', function(){
    console.log('Socket disconnected: '+socket.id);
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

//app.use(function (req, res, next) {
//  next(); // <-- important!
//});

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
//  getToken: req => req.cookies.id_token,

  getToken: (req) => {
    console.log('cookies: ' + JSON.stringify(req.cookies));
    let id_token = req.cookies.id_token;
    console.log('id_token: '+ id_token);
    return id_token;
  }

}));
app.use(passport.initialize());

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(JSON.parse(JSON.stringify(req.user)), auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  const history = createHistory(req.url);
  // let currentLocation = history.getCurrentLocation();
  let sent = false;
  const removeHistoryListener = history.listen(location => {
    const newUrl = `${location.pathname}${location.search}`;
    if (req.originalUrl !== newUrl) {
      // console.log(`R ${req.originalUrl} -> ${newUrl}`); // eslint-disable-line no-console
      if (!sent) {
        res.redirect(303, newUrl);
        sent = true;
        next();
      } else {
        console.error(`${req.path}: Already sent!`); // eslint-disable-line no-console
      }
    }
  });

  let initialState = null;

  console.log("req.headers.cookie:"+req.headers.cookie);
  console.log("req.user: "+JSON.stringify(req.user));
  console.log("req.cookies: "+JSON.stringify(req.cookies));

  let clientStoreID = null;
  if (req.method === 'GET') {

    // check if client sent cookie
    var cookie = req.cookies.clientStoreID;
    if (cookie === undefined) {
      // no: set a new cookie
      clientStoreID = uuid.v1();
      res.cookie('clientStoreID',clientStoreID, { maxAge: 900000, httpOnly: true });
      console.log('cookie created successfully');
    } else {
    // yes, cookie was already present
      clientStoreID = cookie;
      console.log('cookie exists', cookie);
    }
  }

   let clientState = null;// serverStore.getState().get('clients').get(clientStoreID);
   if (clientState) {
     initialState = clientState;
   } else {
      initialState = fromJS({
        gameplay: {
          games: {}
        }
      });
  }

  try {
    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      history,
    });

    store.dispatch(setRuntimeVariable({
      name: 'clientStoreID',
      value: clientStoreID
    }));

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));
    let css = new Set();
    let statusCode = 200;
    const data = { title: '', description: '', style: '', script: assets.main.js, children: '' };

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        store,
        createHref: history.createHref,
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = new Set();
        statusCode = status;
        data.children = ReactDOM.renderToString(component);
        data.state = store.getState();
        data.style = [...css].join('');
        return true;
      },
    });

    if (!sent) {
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(statusCode);
      res.send(`<!doctype html>${html}`);
    }
  } catch (err) {
    next(err);
  } finally {
    removeHistoryListener();
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
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(statusCode);
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
