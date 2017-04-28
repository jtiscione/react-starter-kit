import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './CollapsibleArea.css';


class CollapsibleArea extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]).isRequired,
  };

  state = {
    expanded: {},
  };

  componentWillMount() {
    const expanded = {};
    React.Children.map(this.props.children,
      child => child.props.label).forEach((label) => { expanded[label] = true; });
    this.setState({ expanded });
  }

  render() {
    const onClick = label => (e) => { // eslint-disable-line no-unused-vars
      const expanded = {
        label: this.state.expanded[label] = !this.state.expanded[label], ...this.state.expanded,
      };
      this.setState({ expanded });
    };

    return (<div className={s.outermost}>
      {
        React.Children.map(this.props.children, child =>
          <div>
            <div className={s.singlebutton}>
              <Button bsStyle="primary" onClick={onClick(child.props.label)}>
                {child.props.label}
              </Button>
            </div>
            <div className={this.state.expanded[child.props.label] ? s.expanded : s.contracted}>
              { child }
            </div>
          </div>,
        )
      }
    </div>);
  }
}

export default withStyles(s)(CollapsibleArea);
