import React from "react";
import { NavLink as RRNavLink } from "react-router-dom";

// import AuthContext from 'context/auth/authContext';
// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";

function IndexNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 299 ||
        document.body.scrollTop > 299
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 300 ||
        document.body.scrollTop < 300
      ) {
        setNavbarColor("navbar-transparent");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const onLogoutClick = e => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand href="/" id="navbar-brand">
              ZCinema
            </NavbarBrand>
            <button
              className="navbar-toggler navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse
            className="justify-content-end"
            isOpen={collapseOpen}
            navbar
          >
            <Nav navbar>
              {auth.isAuthenticated ? (
                <>
                  {auth.user.role === "admin" ? (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Admin
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem tag={RRNavLink} to="/admin/movies">
                          Movies
                        </DropdownItem>
                        <DropdownItem tag={RRNavLink} to="/admin/transactions">
                          Transactions
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    ""
                  )}
                  <NavItem>
                    <NavLink tag={RRNavLink} to="/about">
                      <p>About</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={RRNavLink} to="/account">
                      <p>Account</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#" onClick={onLogoutClick}>
                      <p>Logout</p>
                    </NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem>
                    <NavLink tag={RRNavLink} to="/about">
                      <p>About</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={RRNavLink} to="/signin">
                      <p>Sign In</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={RRNavLink} to="/register">
                      <p>Register</p>
                    </NavLink>
                  </NavItem>
                </>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default IndexNavbar;
