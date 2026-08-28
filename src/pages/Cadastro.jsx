import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";

function Cadastro() {
  const [tipoUsuario, setTipoUsuario] = useState("usuario");

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="cadastro-icon">
          🌱
        </div>

        <h1>Crie sua conta</h1>

        <p className="cadastro-description">
          Faça parte do Raiz Urbana.
        </p>

        {/* TIPO DE CADASTRO */}
        <div className="tipo-cadastro">
          <p>Você deseja se cadastrar como:</p>

          <div className="tipo-opcoes">
            <button
              type="button"
              className={`tipo-option ${
                tipoUsuario === "usuario" ? "selected" : ""
              }`}
              onClick={() => setTipoUsuario("usuario")}
            >
              <span className="tipo-icon">👤</span>

              <strong>Usuário</strong>

              <small>
                Solicitar e acompanhar plantios.
              </small>
            </button>

            <button
              type="button"
              className={`tipo-option ${
                tipoUsuario === "gestor" ? "selected gestor" : ""
              }`}
              onClick={() => setTipoUsuario("gestor")}
            >
              <span className="tipo-icon">🏢</span>

              <strong>Gestor</strong>

              <small>
                Gerenciar ações e solicitações.
              </small>
            </button>
          </div>
        </div>

        <form className="cadastro-form">

          {/* DADOS PESSOAIS */}
          <div className="cadastro-section">
            <h2>Dados pessoais</h2>

            <div className="cadastro-field">
              <label htmlFor="nome">Nome completo</label>

              <input
                type="text"
                id="nome"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cpf">CPF</label>

                <input
                  type="text"
                  id="cpf"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="telefone">Telefone</label>

                <input
                  type="tel"
                  id="telefone"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="email">E-mail</label>

              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
              />
            </div>
          </div>

          {/* INFORMAÇÕES DO GESTOR */}
          {tipoUsuario === "gestor" && (
            <div className="cadastro-section gestor-section">
              <h2>Informações do gestor</h2>

              <div className="cadastro-field">
                <label htmlFor="instituicao">
                  Instituição / órgão
                </label>

                <input
                  type="text"
                  id="instituicao"
                  placeholder="Nome da instituição ou órgão"
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="emailInstitucional">
                  E-mail institucional
                </label>

                <input
                  type="email"
                  id="emailInstitucional"
                  placeholder="Digite seu e-mail institucional"
                />
              </div>
            </div>
          )}

          {/* ENDEREÇO */}
          <div className="cadastro-section">
            <h2>Endereço</h2>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cep">CEP</label>

                <input
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="numero">Número</label>

                <input
                  type="text"
                  id="numero"
                  placeholder="Número"
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="rua">Rua</label>

              <input
                type="text"
                id="rua"
                placeholder="Digite sua rua"
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="bairro">Bairro</label>

              <input
                type="text"
                id="bairro"
                placeholder="Digite seu bairro"
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cidade">Cidade</label>

                <input
                  type="text"
                  id="cidade"
                  placeholder="Cidade"
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="estado">Estado</label>

                <input
                  type="text"
                  id="estado"
                  placeholder="UF"
                  maxLength="2"
                />
              </div>
            </div>
          </div>

          {/* SENHA */}
          <div className="cadastro-section">
            <h2>Senha</h2>

            <div className="cadastro-field">
              <label htmlFor="senha">Senha</label>

              <input
                type="password"
                id="senha"
                placeholder="Crie uma senha"
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="confirmarSenha">
                Confirmar senha
              </label>

              <input
                type="password"
                id="confirmarSenha"
                placeholder="Digite a senha novamente"
              />
            </div>
          </div>

          <button type="submit" className="cadastro-submit">
            Criar conta
          </button>
        </form>

        <div className="login-link">
          <span>Já possui uma conta?</span>

          <Link to="/login">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;