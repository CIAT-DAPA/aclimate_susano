import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import "./Menu.css";

function Menu() {
  return (
    <Navbar collapseOnSelect expand="lg" className="w-100 p-0 bg-dark navbar-dark">
      <Container className="py-1">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-3 text-light"
        >
          <img
            src={logo}
            width="35"
            height="35"
            alt="Aclimate Nicaragua Logo"
            className="d-inline-block align-top"
          />
          AClimate Nicaragua
        </Link>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          id="responsive-navbar-nav"
        >
          <Nav className="align-items-lg-center">
            <Link className="nav-link text-light" to="/estaciones">
              Estaciones
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
