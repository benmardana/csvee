import { Navbar, Alignment, NavbarDivider } from '@blueprintjs/core';
import React from 'react';

const NavBar = ({ children }: { children: React.ReactNode }) => (
  <Navbar>
    <Navbar.Group align={Alignment.LEFT}>
      <Navbar.Heading>CSVee</Navbar.Heading>
      <NavbarDivider />
      {children}
    </Navbar.Group>
  </Navbar>
);

export default NavBar;
