import React from 'react';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';
import Content from './Content';

export default {

  path: '*',

  async action({ path }) { // eslint-disable-line react/prop-types
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{content(path:"${path}"){path,title,content,component}}`,
      }),
      credentials: 'include',
    });
    if (resp.status !== 200) throw new Error(resp.statusText);
    const { data } = await resp.json();
    if (!data || !data.content) return undefined;
    return {
      title: data.content.title,
      component: <Layout><Content {...data.content} /></Layout>,
    };
  },

};
