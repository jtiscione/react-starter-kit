/**
 * Created by Jason on 6/17/2016.
 */
import React from 'react';
import { PlayContainer } from './Play';

const title = 'Redux Chess';

export default {

  path: '/play',

  action() {
    return {
      title,
      component: <PlayContainer />,
    };
  },

};
