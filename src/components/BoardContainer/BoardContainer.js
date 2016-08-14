import Link from '../Link';

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BoardContainer.css';

const $ = require('jquery');

let board = null;

class BoardContainer extends Component {

  static propTypes = {
    divID: PropTypes.string.isRequired,
    makeConfigObject: PropTypes.func.isRequired,
  };

  componentWillMount() {
    // console.log("BoardContainer: componentWillMount");
    // console.log("jQuery: "+$);
  }

  componentDidMount() {
    console.log('BoardContainer: componentDidMount');

    const cfg = this.props.makeConfigObject();
    console.log(typeof cfg);
    board = new window.ChessBoard(this.props.divID, cfg);

    console.log("jQuery: "+$);

    // $('#'+this.props.divID).resize(function() {
    //   board.resize();
    // });
    //const self = this;
    $(window).resize(() => {
      let id = this.props.divID;
      console.log("id: "+id);
      console.log("ww: "+$(window).innerWidth());
      console.log("div:"+$("#"+id).width());
      const ww = $(window).innerWidth();
      const wh = $(window).innerHeight();
      const dw = $("#"+id).width();
      if (ww < dw) {
        $("#"+id).width(ww);
      } else if (wh < dw) {
        $("#"+id).width(wh);
      } else {
        $("#"+id).width("auto");
      }
      board.resize();
    });
  }

  render() {
    console.log('BoardComponent: render');
    let dangerousHTML = `<div id="${this.props.divID}"></div>`;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div dangerouslySetInnerHTML = {{__html: dangerousHTML}} />
        </div>
      </div>
    );
//      <div id={this.props.divID} style={{"width": this.props.boardWidth}}>BoardContainer...</div>
  }
//  <div dangerouslySetInnerHTML = {{__html: dangerousHTML}} />
//          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>

}

export default withStyles(s)(BoardContainer);
