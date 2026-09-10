import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarSenha.css";

function RecuperarSenha() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Se existir uma conta cadastrada para ${email}, enviaremos as instruções de recuperação.`
    );

    setEmail("");
  };

  return (
    <main className="recuperar-page">
      <div className="recuperar-container">

        <div className="recuperar-card">

          <div className="recuperar-icon">
            🔐
          </div>

          <span className="recuperar-label">
            Recuperação de acesso
          </span>

          <h1>Esqueceu sua senha?</h1>

          <p className="recuperar-descricao">
            Informe o e-mail cadastrado na sua conta para receber
            as instruções de recuperação de senha.
          </p>

          <form
            className="recuperar-form"
            onSubmit={handleSubmit}
          >

            <div className="recuperar-field">

              <label htmlFor="email">
                E-mail
              </label>

              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <button
              type="submit"
              className="recuperar-submit"
            >
              Enviar instruções
            </button>

          </form>

          <div className="recuperar-voltar">

            <Link to="/login">
              ← Voltar para o login
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default RecuperarSenha;