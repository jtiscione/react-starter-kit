import React, { Component, PropTypes } from 'react';

import { Modal, Button } from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NewGameDialog.css';

class NewGameDialog extends Component {

  render() {
    const { onNewGame } = this.props;
    return (
      <div className="outermost">
        <Modal>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onNewGame}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

NewGameDialog.propTypes = {
  onNewGame: PropTypes.func.isRequired,
};

export default withStyles(s)(NewGameDialog);
