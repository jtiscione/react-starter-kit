import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Content.css';

class Content extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    title: PropTypes.string,
  };

  render() {
    const { path, title, content } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          {title && path !== '/' && <h1>{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Content);
