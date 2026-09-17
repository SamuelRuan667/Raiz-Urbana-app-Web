import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState("USUARIO");
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: "",
    instituicao: "",
    emailInstitucional: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (form.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (
      tipoUsuario === "GESTOR" &&
      (!form.instituicao.trim() ||
        !form.emailInstitucional.trim())
    ) {
      alert(
        "Preencha a instituição e o e-mail institucional."
      );
      return;
    }

    const dados = {
      nomeCompleto: form.nomeCompleto,
      cpf: form.cpf,
      telefone: form.telefone,
      email: form.email,
      cep: form.cep,
      numero: form.numero,
      rua: form.rua,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado.toUpperCase(),
      senha: form.senha,
      confirmarSenha: form.confirmarSenha,
      tipo: tipoUsuario,
      instituicao:
        tipoUsuario === "GESTOR"
          ? form.instituicao
          : null,
      emailInstitucional:
        tipoUsuario === "GESTOR"
          ? form.emailInstitucional
          : null,
    };

    try {
      setCarregando(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
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
            "Não foi possível criar a conta."
        );
      }

      alert(
        resposta?.mensagem ||
          "Conta criada com sucesso!"
      );

      navigate("/login");
    } catch (error) {
      console.error("Erro ao criar conta:", error);

      alert(
        error.message ||
          "Erro ao conectar com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  };

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

        <div className="tipo-cadastro">
          <p>Você deseja se cadastrar como:</p>

          <div className="tipo-opcoes">
            <button
              type="button"
              className={`tipo-option ${
                tipoUsuario === "USUARIO"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setTipoUsuario("USUARIO")
              }
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
                tipoUsuario === "GESTOR"
                  ? "selected gestor"
                  : ""
              }`}
              onClick={() =>
                setTipoUsuario("GESTOR")
              }
            >
              <span className="tipo-icon">🏢</span>

              <strong>Gestor</strong>

              <small>
                Gerenciar ações e solicitações.
              </small>
            </button>
          </div>
        </div>

        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >
          <div className="cadastro-section">
            <h2>Dados pessoais</h2>

            <div className="cadastro-field">
              <label htmlFor="nomeCompleto">
                Nome completo
              </label>

              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                placeholder="Digite seu nome completo"
                value={form.nomeCompleto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cpf">
                  CPF
                </label>

                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="telefone">
                  Telefone
                </label>

                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="email">
                E-mail
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {tipoUsuario === "GESTOR" && (
            <div className="cadastro-section gestor-section">
              <h2>Informações do gestor</h2>

              <div className="cadastro-field">
                <label htmlFor="instituicao">
                  Instituição / órgão
                </label>

                <input
                  type="text"
                  id="instituicao"
                  name="instituicao"
                  placeholder="Nome da instituição ou órgão"
                  value={form.instituicao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="emailInstitucional">
                  E-mail institucional
                </label>

                <input
                  type="email"
                  id="emailInstitucional"
                  name="emailInstitucional"
                  placeholder="Digite seu e-mail institucional"
                  value={form.emailInstitucional}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="cadastro-section">
            <h2>Endereço</h2>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cep">
                  CEP
                </label>

                <input
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="numero">
                  Número
                </label>

                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número"
                  value={form.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="rua">
                Rua
              </label>

              <input
                type="text"
                id="rua"
                name="rua"
                placeholder="Digite sua rua"
                value={form.rua}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="bairro">
                Bairro
              </label>

              <input
                type="text"
                id="bairro"
                name="bairro"
                placeholder="Digite seu bairro"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cidade">
                  Cidade
                </label>

                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="estado">
                  Estado
                </label>

                <input
                  type="text"
                  id="estado"
                  name="estado"
                  placeholder="UF"
                  maxLength={2}
                  value={form.estado}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cadastro-section">
            <h2>Senha</h2>

            <div className="cadastro-field">
              <label htmlFor="senha">
                Senha
              </label>

              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Crie uma senha"
                value={form.senha}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="confirmarSenha">
                Confirmar senha
              </label>

              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                value={form.confirmarSenha}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="cadastro-submit"
            disabled={carregando}
          >
            {carregando
              ? "Criando conta..."
              : "Criar conta"}
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