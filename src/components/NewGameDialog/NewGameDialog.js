import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button, ButtonGroup } from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NewGameDialog.css';

class NewGameDialog extends Component {

  static propTypes = {
    onNewGame: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.go = this.go.bind(this);
  }

  state = {
    level: 1,
    side: 'white',
  };

  go() {
    this.props.onNewGame(this.state.level, this.state.side);
  }

  render() {
    const { show, onHide } = this.props;

    const setLevel = level => e => this.setState({ level }); // eslint-disable-line no-unused-vars

    const setSide = side => e => this.setState({ side }); // eslint-disable-line no-unused-vars

    return (
      <div className="outermost">
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>New Game</Modal.Title>
          </Modal.Header>
          <Modal.Body className={s.center}>
            <h4>Difficulty</h4>
            <ButtonGroup>
              <Button onClick={setLevel(1)} bsStyle={this.state.level === 1 ? 'primary' : 'info'}>1</Button>
              <Button onClick={setLevel(2)} bsStyle={this.state.level === 2 ? 'primary' : 'info'}>2</Button>
              <Button onClick={setLevel(3)} bsStyle={this.state.level === 3 ? 'primary' : 'info'}>3</Button>
              <Button onClick={setLevel(4)} bsStyle={this.state.level === 4 ? 'primary' : 'info'}>4</Button>
              <Button onClick={setLevel(5)} bsStyle={this.state.level === 5 ? 'primary' : 'info'}>5</Button>
              <Button onClick={setLevel(6)} bsStyle={this.state.level === 6 ? 'primary' : 'info'}>6</Button>
              <Button onClick={setLevel(7)} bsStyle={this.state.level === 7 ? 'primary' : 'info'}>7</Button>
              <Button onClick={setLevel(8)} bsStyle={this.state.level === 8 ? 'primary' : 'info'}>8</Button>
            </ButtonGroup>
            <h4>Side</h4>
            <div className={s.kings}>
              { /* eslint-disable */}
              <div>
                <img className={this.state.side === 'white' ? s.selected : s.unselected} onClick={setSide('white')} alt="white" src="/wK.png" />
                <div>White</div>
              </div>
              <div>
                <img className={this.state.side === 'black' ? s.selected : s.unselected} onClick={setSide('black')} alt="black" src="/bK.png" />
                <div>Black</div>
              </div>
              <div>
                <img className={this.state.side === 'random' ? s.selected : s.unselected} onClick={setSide('random')} alt="white" src="/wbK.png" />
                <div>random</div>
              </div>
              { /* eslint-enable */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.go}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(NewGameDialog);
