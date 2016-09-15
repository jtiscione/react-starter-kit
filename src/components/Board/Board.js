import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Board.css';

const $ = require('jquery');

class Board extends Component {

  static propTypes = {
    fen: PropTypes.string.isRequired,
    divID: PropTypes.string.isRequired,
    dimensions: PropTypes.number.isRequired,
    allowMoves: PropTypes.bool.isRequired,
    targetSquares: PropTypes.func.isRequired,
    makeMove: PropTypes.func.isRequired, // Will dispatch event
  };

  constructor(...args) {
    super(...args);
    this.chessboard = null;
  }

  componentDidMount() {
    console.log("componentDidMount");
    const props = this.props;

    var cfg = {
      cameraControls: true,
        position: props.fen,
      pieceTheme: '../../chess/img/wikipedia/{piece}.png',
      fontData: '../../chess/assets/fonts/helvetiker_regular.typeface.json',
      pieceSet: '../../chess/assets/chesspieces/iconic/{piece}.json',
      draggable: true,
      zoomable: true,
      onDrop: (source, target) => { // , pieceCode, newPosition, priorPosition, orientation) => {
        // User's turn?
        if (!props.allowMoves) {
          return 'snapback';
        }
        const targetSquares = props.targetSquares(source);
        if (targetSquares.indexOf(target) === -1) {
          return 'snapback';
        }
        return null;
      },
      onSnapEnd: (from, to) => {   // , pieceCode) => {
        setTimeout(() => {
          props.makeMove(from, to); // will dispatch action into redux store
        });
      },
      onMouseoverSquare: (square) => {
        const targetSquares = props.targetSquares(square);
        if (targetSquares.length === 0) {
          return;
        }
        if (this.chessboard.hasOwnProperty('greySquare')) {
          // highlight the square they moused over
          this.chessboard.greySquare(square);
          // highlight the possible squares for this piece
          targetSquares.forEach((sq) => {
            this.chessboard.greySquare(sq);
          });
        }
      },
      onMouseoutSquare: () => { // square, piece) => {
        if (this.chessboard.hasOwnProperty('removeGreySquares')) {
          this.chessboard.removeGreySquares();
        }
      },
    };

    if (props.dimensions === 3) {
      this.chessboard = new window.ChessBoard3(this.props.divID, cfg);
    } else {
      this.chessboard = new window.ChessBoard(this.props.divID, cfg);
    }

    $(window).resize(() => {
      this.chessboard.resize();
    });
  }

  // This component only needs to call render() once, so this method always returns false.
  // However it needs to intercept the new FEN so it can send any changes to the chessboard object.
  shouldComponentUpdate(nextProps) { // , nextState) {
    console.log("shouldComponentUpdate");
    if (this.chessboard) {
      this.chessboard.position(nextProps.fen);
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className={s.divClass} id={this.props.divID}>
      </div>
    );
  }

}

export default withStyles(s)(Board);
