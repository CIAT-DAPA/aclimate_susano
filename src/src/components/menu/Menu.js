import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Menu.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../../assets/img/logo.png";

function Menu() {
  return (
    <Navbar collapseOnSelect expand="lg" className="w-100 p-0 bg-dark">
      <Container className="py-1 ">
        <Navbar.Brand
          href="/"
          className="d-flex align-items-center gap-3 text-light"
        >
          <img
            alt=""
            src={logo}
            width="35"
            height="35"
            className="d-inline-block align-top"
          />
          Aclimate Monitoring
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end  "
          id="responsive-navbar-nav"
        >
          <Nav className="justify-content-end align-items-lg-center">
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
