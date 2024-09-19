import React from "react";
import { Container } from "react-bootstrap";
import cgiarLogo from "../../assets/img/cgiar.png";
import allianceLogo from "../../assets/img/alliance.png";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-light">
      <Container>
        <section className="py-5">
          <div className="row">
            {/* Sección de Navegación */}
            <nav className="col">
              <h5>Secciones</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-light" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item mb-2 item-footer">
                  <Link className="nav-link text-light" to="/estaciones">
                    Estaciones
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Sección de Contacto */}
            <section className="col">
              <h5>Contacto</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2 item-footer">
                  <a
                    href="mailto: J.R.Villegas@cgiar.org"
                    className="nav-link text-light"
                  >
                    J.R.Villegas@cgiar.org
                  </a>
                </li>
              </ul>
            </section>

            {/* Sección de Socios */}
            <section className="col">
              <h5>Socios:</h5>
              <div className="d-flex align-items-center">
                <img
                  src={cgiarLogo}
                  alt="partner CGIAR"
                  className="partner-logo mx-3"
                />
                <img
                  src={allianceLogo}
                  alt="partner Alliance"
                  className="partner-logo mx-3"
                />
              </div>
            </section>
          </div>
        </section>
      </Container>
    </footer>
  );
}

export default Footer;
