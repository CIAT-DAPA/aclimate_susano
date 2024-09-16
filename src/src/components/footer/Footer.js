import React from "react";
import { Container } from "react-bootstrap";
import cgiarLogo from "../../assets/img/cgiar.png";
import allianceLogo from "../../assets/img/alliance.png";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <Container>
        <footer className="py-5">
          <div className="row">
            <div className="col ">
              <h5>Secciones</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-white" to="/estaciones">
                    Estaciones
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col ">
              <h5>Contacto</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <a
                    href="mailto: J.R.Villegas@cgiar.org"
                    className="nav-link text-white "
                  >
                    J.R.Villegas@cgiar.org
                  </a>
                </li>
              </ul>
            </div>
            <div className="col ">
              <h5>Socios:</h5>
              <img
                src={cgiarLogo}
                alt="partner CGIAR"
                className="mx-3 my-2 my-md-0"
              />
              <img
                src={allianceLogo}
                alt="partner Alliance"
                className="mx-3 my-2 my-md-0"
              />
            </div>
          </div>
        </footer>
      </Container>
    </footer>
  );
}

export default Footer;
