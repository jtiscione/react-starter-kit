/**
 * Created by Jason on 6/17/2016.
 */
import React from 'react';
import { PlayContainer } from './Play';

const title = 'Play Against Computer';

export default {

  path: '/play',

  action() {
    return {
      title,
      component: <PlayContainer/>
    };
  },

};
