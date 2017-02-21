import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';

// import Feedback from '../Feedback';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  /*
  Removed <Feedback />
  */

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default withStyles(s)(Layout);
