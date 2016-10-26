/**
 * Created by jason on 10/4/16.
 */
import React from 'react';
import { StartContainer } from './Start';

const title = 'Play Against Computer';

export default {

  path: '/',

  action() {
    return {
      title,
      component: <StartContainer/>
    };
  },

};
