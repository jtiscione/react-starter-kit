import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import cx from 'classnames';
import s from './OpeningBookEntry.css';

function OpeningBookEntry({ san, whiteWins, blackWins, draws, totalGames, opening,
                            clickFunction, mouseEnterFunction, mouseLeaveFunction }) {
  const all = whiteWins + blackWins + draws;
  const whitePercentage = Math.round((whiteWins / all) * 100);
  const blackPercentage = Math.round((blackWins / all) * 100);
  const drawPercentage = 100 - whitePercentage - blackPercentage; // avoid roundoff errors

  const whitePercentageLabel = (whitePercentage < 20 ? '' : `${whitePercentage}%`);
  const drawPercentageLabel = (drawPercentage < 20 ? '' : `${drawPercentage}%`);
  const blackPercentageLabel = (blackPercentage < 20 ? '' : `${blackPercentage}%`);

  const whiteTooltip = <Tooltip id="whiteToolTip">{`${whitePercentageLabel} won by white`}</Tooltip>;
  const drawTooltip = <Tooltip id="blackToolTip">{`${blackPercentageLabel} draws`}</Tooltip>;
  const blackTooltip = <Tooltip id="blackToolTip">{`${blackPercentageLabel} won by black`}</Tooltip>;

  const gameCountToolTip = <Tooltip id="gameCountTooltip">{`${all} games out of ${totalGames}`}</Tooltip>;

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div
      className={s.row}
      onMouseEnter={mouseEnterFunction}
      onMouseLeave={mouseLeaveFunction}
      onClick={clickFunction}
    >
      <div className={cx(s.san, 'text-danger')}>
        {san}
      </div>
      <OverlayTrigger placement="top" overlay={gameCountToolTip}>
        <div className={s.gameCount}><Badge pullRight bsClass={cx(s.badge, 'badge')}>{all}</Badge></div>
      </OverlayTrigger>
      <div className={s.bar}>
        <OverlayTrigger placement="left" overlay={whiteTooltip}>
          <div className={s.white} style={{ width: `${whitePercentage}%` }} onClick={clickFunction}>
            {whitePercentageLabel}
          </div>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={drawTooltip}>
          <div className={s.gray} style={{ width: `${drawPercentage}%` }} onClick={clickFunction}>
            {drawPercentageLabel}
          </div>
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={blackTooltip}>
          <div className={s.black} style={{ width: `${blackPercentage}%` }} onClick={clickFunction}>
            {blackPercentageLabel}
          </div>
        </OverlayTrigger>
      </div>
      <div className={s.caption}>{opening}</div>
    </div>
  );
  /* eslint-disable jsx-a11y/no-static-element-interactions */
}

OpeningBookEntry.propTypes = {
  san: PropTypes.string.isRequired,
  whiteWins: PropTypes.number.isRequired,
  blackWins: PropTypes.number.isRequired,
  draws: PropTypes.number.isRequired,
  totalGames: PropTypes.number.isRequired,
  opening: PropTypes.string,
  clickFunction: PropTypes.func.isRequired,
  mouseEnterFunction: PropTypes.func.isRequired,
  mouseLeaveFunction: PropTypes.func.isRequired,
};

OpeningBookEntry.defaultProps = {
  opening: '',
};

export default withStyles(s)(OpeningBookEntry);
