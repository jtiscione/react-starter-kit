import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';

/*
import Navigation from '../Navigation';
instead, import this stuff from react-bootstrap:
import logoUrl from './logo-small.png';
*/

import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap';

const Hdr = Navbar.Header;
const Brand = Navbar.Brand;

class Header extends React.Component {
  render() {
    return (
      /*
       <div className={s.root}>
       <div className={s.container}>
       <Navigation className={s.nav} />
       <Link className={s.brand} to="/">
       <img src={logoUrl} width="38" height="38" alt="React" />
       <span className={s.brandTxt}>Your Company</span>
       </Link>
       <div className={s.banner}>
       <h1 className={s.bannerTitle}>React</h1>
       <p className={s.bannerDesc}>Complex web apps made easy</p>
       </div>
       </div>
       </div>
       Replaced the above with:
       */
      <Navbar>
        <Hdr>
          <Brand>
            <Link className={s.brand} to="/">Redux Chess</Link>
          </Brand>
        </Hdr>
        <Nav bsStyle="tabs">
          <NavItem eventKey={1} href="/play">Play</NavItem>
          <NavItem eventKey={2} href="/about">About</NavItem>
          <NavItem eventKey={3} href="/contact">Contact</NavItem>
          <NavItem eventKey={4} href="/login">Log In</NavItem>
          <NavItem eventKey={5} href="/register">Sign Up</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default withStyles(s)(Header);
