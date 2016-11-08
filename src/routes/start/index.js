/**
 * Created by jason on 10/4/16.
 */
import React from 'react';
import { StartContainer } from './Start';

const title = 'Redux Chess';

export default {

  path: '/',

  action() {
    return {
      title,
      component: <StartContainer/>
    };
  },

};
