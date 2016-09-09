/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';


function Header() {
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
      <Navbar.Header>
        <Navbar.Brand>
          <Link className={s.brand} to="/">Redux Chess</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav bsStyle="tabs">
        <NavItem eventKey={1} href="/play">Play Chess</NavItem>
        <NavItem eventKey={2} href="/about">About</NavItem>
        <NavItem eventKey={3} href="/contact">Contact</NavItem>
        <NavItem eventKey={4} href="/login">Log In</NavItem>
        <NavItem eventKey={5} href="/register">Sign Up</NavItem>
      </Nav>
    </Navbar>
  );
}

export default withStyles(s)(Header);
