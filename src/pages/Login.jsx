import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      let resposta = null;

      try {
        resposta = await response.json();
      } catch {
        resposta = null;
      }

      if (!response.ok) {
        throw new Error(
          resposta?.message ||
            resposta?.mensagem ||
            "E-mail ou senha inválidos."
        );
      }

      const usuario = {
        id: resposta.id,
        nomeCompleto: resposta.nomeCompleto,
        email: resposta.email,
        tipo: resposta.tipo,
      };

      if (lembrar) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(usuario)
        );

        sessionStorage.removeItem("usuarioLogado");
      } else {
        sessionStorage.setItem(
          "usuarioLogado",
          JSON.stringify(usuario)
        );

        localStorage.removeItem("usuarioLogado");
      }

      if (resposta.tipo === "GESTOR") {
        navigate("/gestor");
      } else {
        navigate("/perfil");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      alert(
        error.message ||
          "Não foi possível conectar ao servidor."
      );
    } finally {
      setCarregando(false);
    }
  };

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

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Senha
            </label>

            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) =>
                  setLembrar(e.target.checked)
                }
              />

              <span>Lembrar de mim</span>
            </label>

            <Link
              to="/recuperar-senha"
              className="forgot-password"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={carregando}
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <div className="login-register">
          <span>
            Ainda não tem uma conta?
          </span>

          <Link to="/cadastro">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;