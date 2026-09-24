import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [usuarioLogado, setUsuarioLogado] =
    useState(null);

  const carregarUsuario = () => {
    const usuarioSalvo =
      sessionStorage.getItem("usuarioLogado") ||
      localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
      setUsuarioLogado(null);
      return;
    }

    try {
      setUsuarioLogado(
        JSON.parse(usuarioSalvo)
      );
    } catch {
      sessionStorage.removeItem("usuarioLogado");
      localStorage.removeItem("usuarioLogado");
      setUsuarioLogado(null);
    }
  };

  useEffect(() => {
    carregarUsuario();

    window.addEventListener(
      "usuarioLogadoAtualizado",
      carregarUsuario
    );

    window.addEventListener(
      "storage",
      carregarUsuario
    );

    return () => {
      window.removeEventListener(
        "usuarioLogadoAtualizado",
        carregarUsuario
      );

      window.removeEventListener(
        "storage",
        carregarUsuario
      );
    };
  }, []);

  const rotaPerfil = !usuarioLogado
  ? "/login"
  : usuarioLogado.tipo === "BOSS"
  ? "/admin"
  : usuarioLogado.tipo === "GESTOR"
  ? "/gestor"
  : "/perfil";

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

          <Link to="/consultar-status">
            Consultar Status
          </Link>

          <Link to="/recompensas">
            Recompensas
          </Link>

          <Link to="/quem-somos">
            Quem Somos
          </Link>
        </nav>

        <div className="header-buttons">

          <Link
            to="/solicitar-plantio"
            className="planting-button"
          >
            Solicitar Plantio
          </Link>

          {!usuarioLogado && (
            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>
          )}

          <Link
            to={rotaPerfil}
            className="profile-button"
            title={
              !usuarioLogado
                ? "Entrar"
                : usuarioLogado.tipo === "BOSS"
                ? "Painel administrativo"
                : usuarioLogado.tipo === "GESTOR"
                ? "Painel do gestor"
                : "Meu perfil"
            }
          >
            👤
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Header;