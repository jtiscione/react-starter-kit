import React, { Component, PropTypes } from 'react';

import {
  Button,
  ButtonGroup,
  Glyphicon,
} from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlayButtons.css';

function PlayButtons({ className }) {
  return (
    <div className="panel-footer clearfix btn-block">
      <ButtonGroup justified>
        <Button bsClass={s.fatbutton}>
          <Glyphicon glyph="fast-backward" />
        </Button>
        <Button bsClass={s.fatbutton}>
          <Glyphicon glyph="step-backward" />
        </Button>
        <Button bsClass={s.fatbutton}>
          <Glyphicon glyph="step-forward" />
        </Button>
        <Button bsClass={s.fatbutton}>
          <Glyphicon glyph="fast-forward" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

PlayButtons.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(PlayButtons);
