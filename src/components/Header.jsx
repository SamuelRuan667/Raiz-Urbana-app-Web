import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">

        <Link to="/" className="logo">

          <div className="logo-icon">
            <div className="logo-face">
              <span></span>
              <span></span>
              <div className="logo-mouth"></div>
            </div>
          </div>

          <span>Raiz Urbana</span>

        </Link>

        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/consultar-status">Consultar Status</Link>
          <Link to="/recompensas">Recompensas</Link>
          <Link to="/quem-somos">Quem Somos</Link>
        </nav>

        <div className="header-buttons">

          <Link
            to="/solicitar-plantio"
            className="planting-button"
          >
            Solicitar Plantio
          </Link>

          <Link
            to="/login"
            className="login-button"
          >
            Login
          </Link>

          <Link
            to="/perfil"
            className="profile-button"
            title="Meu perfil"
          >
            👤
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Header;