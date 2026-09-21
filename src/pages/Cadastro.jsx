import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState("USUARIO");
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [erroCpf, setErroCpf] = useState("");

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
    bairroAtuacao: "",
    codigoGestor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const validarCpf = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(cpfLimpo.charAt(i)) * (10 - i);
    }

    let primeiroDigito = (soma * 10) % 11;

    if (primeiroDigito === 10) {
      primeiroDigito = 0;
    }

    if (primeiroDigito !== Number(cpfLimpo.charAt(9))) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(cpfLimpo.charAt(i)) * (11 - i);
    }

    let segundoDigito = (soma * 10) % 11;

    if (segundoDigito === 10) {
      segundoDigito = 0;
    }

    return segundoDigito === Number(cpfLimpo.charAt(10));
  };

  const handleCpfChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }

    valor = valor
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setForm((anterior) => ({
      ...anterior,
      cpf: valor,
    }));

    setErroCpf("");
  };

  const verificarCpf = () => {
    if (!form.cpf) {
      setErroCpf("");
      return;
    }

    if (!validarCpf(form.cpf)) {
      setErroCpf("CPF inválido.");
      return;
    }

    setErroCpf("");
  };

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setErroCep("Digite um CEP válido com 8 números.");

      setForm((anterior) => ({
        ...anterior,
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));

      return;
    }

    setBuscandoCep(true);
    setErroCep("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar CEP.");
      }

      const dados = await response.json();

      if (dados.erro) {
        setErroCep("CEP não encontrado.");

        setForm((anterior) => ({
          ...anterior,
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));

        return;
      }

      setForm((anterior) => ({
        ...anterior,
        cep: cepDigitado,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch (erro) {
      console.error("Erro ao consultar ViaCEP:", erro);

      setErroCep("Não foi possível consultar o CEP.");

      setForm((anterior) => ({
        ...anterior,
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length > 8) {
      valor = valor.slice(0, 8);
    }

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    setForm((anterior) => ({
      ...anterior,
      cep: valor,
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));

    setErroCep("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCpf(form.cpf)) {
      setErroCpf("CPF inválido.");
      alert("Informe um CPF válido.");
      return;
    }

    const cepLimpo = form.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8 || erroCep) {
      alert("Informe um CEP válido.");
      return;
    }

    if (
      !form.rua.trim() ||
      !form.bairro.trim() ||
      !form.cidade.trim() ||
      !form.estado.trim()
    ) {
      alert("Consulte um CEP válido antes de criar a conta.");
      return;
    }

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
      (
        !form.instituicao.trim() ||
        !form.emailInstitucional.trim() ||
        !form.bairroAtuacao.trim() ||
        !form.codigoGestor.trim()
      )
    ) {
      alert("Preencha todas as informações do gestor.");
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

      bairroAtuacao:
        tipoUsuario === "GESTOR"
          ? form.bairroAtuacao
          : null,

      codigoGestor:
        tipoUsuario === "GESTOR"
          ? form.codigoGestor
          : null,
    };

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_URL}/api/auth/cadastro`,
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
              <span className="tipo-icon">
                👤
              </span>

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
              <span className="tipo-icon">
                🏢
              </span>

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
                  maxLength={14}
                  onChange={handleCpfChange}
                  onBlur={verificarCpf}
                  required
                />

                {erroCpf && (
                  <small className="cadastro-error">
                    {erroCpf}
                  </small>
                )}
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

              <div className="cadastro-field">
                <label htmlFor="bairroAtuacao">
                  Bairro de atuação
                </label>

                <input
                  type="text"
                  id="bairroAtuacao"
                  name="bairroAtuacao"
                  placeholder="Digite o bairro de atuação"
                  value={form.bairroAtuacao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="codigoGestor">
                  Senha de autorização do gestor
                </label>

                <input
                  type="password"
                  id="codigoGestor"
                  name="codigoGestor"
                  placeholder="Digite a senha de autorização"
                  value={form.codigoGestor}
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
                  maxLength={9}
                  onChange={handleCepChange}
                  onBlur={(e) =>
                    buscarCep(e.target.value)
                  }
                  required
                />

                {buscandoCep && (
                  <small>
                    Buscando CEP...
                  </small>
                )}

                {erroCep && (
                  <small className="cadastro-error">
                    {erroCep}
                  </small>
                )}
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
                placeholder="Rua"
                value={form.rua}
                readOnly
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
                placeholder="Bairro"
                value={form.bairro}
                readOnly
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
                  readOnly
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
                  value={form.estado}
                  readOnly
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
            disabled={carregando || buscandoCep}
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