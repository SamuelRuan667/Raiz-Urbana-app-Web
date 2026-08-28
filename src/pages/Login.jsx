import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          🌱
        </div>

        <h1>Bem-vindo de volta!</h1>

        <p className="login-description">
          Entre na sua conta do Raiz Urbana.
        </p>

        <form className="login-form">
          <div className="login-field">
            <label htmlFor="email">E-mail</label>

            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>

            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <a href="#" className="forgot-password">
              Esqueci minha senha
            </a>
          </div>

          <button type="submit" className="login-submit">
            Entrar
          </button>
        </form>

        <div className="login-register">
          <span>Ainda não tem uma conta?</span>

          <Link to="/cadastro">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;