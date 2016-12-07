import React from 'react';
import Layout from '../../components/Layout';
import Register from './Register';

const title = 'New User Registration';

export default {

  path: '/register',

  action() {
    return {
      title,
      component: <Layout><Register title={title} /></Layout>,
    };
  },

};
