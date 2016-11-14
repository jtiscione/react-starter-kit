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
    sanSquares: PropTypes.func.isRequired,
    makeMove: PropTypes.func.isRequired, // Will dispatch event
  };

  constructor(...args) {
    super(...args);
    this.chessboard = null;
  }

  componentDidMount() {
    const props = this.props;

    var cfg = {
      cameraControls: true,
        position: props.fen,
      pieceTheme: '../../chess/img/wikipedia/{piece}.png',
      fontData: '../../chess/assets/fonts/helvetiker_regular.typeface.json',
      pieceSet: '../../chess/assets/chesspieces/iconic/{piece}.json',
      draggable: true,
      zoomControls: true,
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

      this.chessboard.greySquare = (sq) => {
        var squareEl = $('#board .square-' + sq);
        var background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d') === true) {
          background = '#696969';
        }
        squareEl.css('background', background);
      };
      this.chessboard.removeGreySquares = () => {
        $('#board .square-55d63').css('background', '');
      };
    }

    $(window).resize(() => {
      this.chessboard.resize();
    });
  }

  // This component only needs to call render() once, so this method always returns false.
  // However it needs to intercept the new FEN so it can send any changes to the chessboard object.
  shouldComponentUpdate(nextProps) { // , nextState) {
    if (this.chessboard) {
      if (nextProps.fen.indexOf(this.chessboard.fen()) === -1) {
        this.chessboard.position(nextProps.fen);
      } else {
        console.log("no change");
      }
      const highlightedSquares = this.props.sanSquares();
      highlightedSquares.forEach((e) => console.log(e));
      this.chessboard.removeGreySquares();
      if (highlightedSquares === null) {
      } else {
        highlightedSquares.forEach((sq) => {
          this.chessboard.greySquare(sq);
        })
      }
      return false;
    }
    return true;
  }

  render() {
    const css = this.props.dimensions === 2 ? s.divClass2 : s.divClass3;
    return (
      <div className={css} id={this.props.divID}></div>
    );
  }

}

export default withStyles(s)(Board);
