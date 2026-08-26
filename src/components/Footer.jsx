import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Coluna 1 - Sobre */}
        <div className="footer-column footer-about">
          <h2>Raiz Urbana</h2>

          <p>
            Transformando nossas cidades através da arborização urbana.
            Um projeto de cidadania e cuidado com o meio ambiente.
          </p>

          <div className="social-links">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <span>f</span>
            </a>

            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <span>◎</span>
            </a>

            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <span>𝕏</span>
            </a>
          </div>
        </div>

        {/* Coluna 2 - Links */}
        <div className="footer-column">
          <h3>Links Úteis</h3>

          <ul>
            <li>
              <Link to="/quem-somos">Sobre Nós</Link>
            </li>

            <li>
              <Link to="/">Termos De Uso</Link>
            </li>

            <li>
              <Link to="/">Aviso Legal</Link>
            </li>

            <li>
              <Link to="/">Política de Privacidade</Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3 - Contato */}
        <div className="footer-column">
          <h3>Contato</h3>

          <ul className="contact-list">
            <li>
              <span className="contact-icon">✉</span>
              <span>raizurbana@gmail.com.br</span>
            </li>

            <li>
              <span className="contact-icon">📍</span>
              <span>Prefeitura do Centro do Recife, Recife Antigo</span>
            </li>

            <li>
              <span className="contact-icon">🕐</span>
              <span>Segunda a Sexta: 08h às 17h</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Raiz Urbana Brasil. Todos os direitos reservados.
        </p>
      </div>

    </footer>
  );
}

export default Footer;