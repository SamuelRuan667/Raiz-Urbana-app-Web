
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
  const [erroCnpj, setErroCnpj] = useState("");

  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const validarCpf = (cpf) => {
    const numero = cpf.replace(/\D/g, "");

    if (numero.length !== 11 || /^(\d)\1{10}$/.test(numero)) {
      return false;
    }

    for (let tamanho = 9; tamanho <= 10; tamanho++) {
      let soma = 0;

      for (let i = 0; i < tamanho; i++) {
        soma += Number(numero[i]) * (tamanho + 1 - i);
      }

      const resto = (soma * 10) % 11;
      const digito = resto === 10 ? 0 : resto;

      if (digito !== Number(numero[tamanho])) {
        return false;
      }
    }

    return true;
  };

  const validarCnpj = (cnpj) => {
    const numero = cnpj.replace(/\D/g, "");

    if (numero.length !== 14 || /^(\d)\1{13}$/.test(numero)) {
      return false;
    }

    const calcularDigito = (pesos) => {
      const soma = pesos.reduce(
        (total, peso, indice) =>
          total + Number(numero[indice]) * peso,
        0
      );

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const primeiro = calcularDigito([
      5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
    ]);

    const segundo = calcularDigito([
      6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
    ]);

    return (
      primeiro === Number(numero[12]) &&
      segundo === Number(numero[13])
    );
  };

  const handleCpfChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "").slice(0, 11);

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

  const handleCnpjChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "").slice(0, 14);

    valor = valor
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");

    setForm((anterior) => ({
      ...anterior,
      cnpj: valor,
    }));

    setErroCnpj("");
  };

  const handleCepChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "").slice(0, 8);

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

  const buscarCep = async (cepDigitado) => {
    const cep = cepDigitado.replace(/\D/g, "");

    if (cep.length !== 8) {
      setErroCep("Digite um CEP válido com 8 números.");
      return;
    }

    setBuscandoCep(true);
    setErroCep("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar o CEP.");
      }

      const dados = await response.json();

      if (dados.erro) {
        throw new Error("CEP não encontrado.");
      }

      setForm((anterior) => ({
        ...anterior,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch (error) {
      setErroCep(error.message || "Não foi possível consultar o CEP.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCpf(form.cpf)) {
      setErroCpf("CPF inválido.");
      return;
    }

    if (tipoUsuario === "EMPRESA_PARCEIRA") {
      if (!validarCnpj(form.cnpj)) {
        setErroCnpj("CNPJ inválido.");
        return;
      }

      if (!form.razaoSocial.trim()) {
        alert("Informe a razão social da empresa.");
        return;
      }
    }

    if (
      form.cep.replace(/\D/g, "").length !== 8 ||
      erroCep ||
      !form.rua.trim() ||
      !form.bairro.trim() ||
      !form.cidade.trim() ||
      !form.estado.trim()
    ) {
      alert("Informe um endereço válido.");
      return;
    }

    if (form.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const dados = {
      nomeCompleto: form.nomeCompleto.trim(),
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.telefone.trim(),
      email: form.email.trim(),
      cep: form.cep.replace(/\D/g, ""),
      numero: form.numero.trim(),
      rua: form.rua.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.toUpperCase(),
      senha: form.senha,
      confirmarSenha: form.confirmarSenha,
      tipo: tipoUsuario,
      cnpj:
        tipoUsuario === "EMPRESA_PARCEIRA"
          ? form.cnpj.replace(/\D/g, "")
          : null,
      razaoSocial:
        tipoUsuario === "EMPRESA_PARCEIRA"
          ? form.razaoSocial.trim()
          : null,
      nomeFantasia:
        tipoUsuario === "EMPRESA_PARCEIRA"
          ? form.nomeFantasia.trim()
          : null,
    };

    setCarregando(true);

    try {
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

      const texto = await response.text();
      let resposta = null;

      try {
        resposta = JSON.parse(texto);
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

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="cadastro-icon">🌱</div>

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
                tipoUsuario === "USUARIO" ? "selected" : ""
              }`}
              onClick={() => setTipoUsuario("USUARIO")}
            >
              <span className="tipo-icon">👤</span>
              <strong>Usuário</strong>
              <small>Solicitar e acompanhar plantios.</small>
            </button>

            <button
              type="button"
              className={`tipo-option ${
                tipoUsuario === "EMPRESA_PARCEIRA"
                  ? "selected"
                  : ""
              }`}
              onClick={() => setTipoUsuario("EMPRESA_PARCEIRA")}
            >
              <span className="tipo-icon">🏢</span>
              <strong>Empresa Parceira</strong>
              <small>Enviar propostas de parceria.</small>
            </button>
          </div>
        </div>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="cadastro-section">
            <h2>
              {tipoUsuario === "EMPRESA_PARCEIRA"
                ? "Dados do responsável"
                : "Dados pessoais"}
            </h2>

            <div className="cadastro-field">
              <label htmlFor="nomeCompleto">
                {tipoUsuario === "EMPRESA_PARCEIRA"
                  ? "Nome completo do responsável"
                  : "Nome completo"}
              </label>
              <input
                id="nomeCompleto"
                name="nomeCompleto"
                type="text"
                value={form.nomeCompleto}
                onChange={handleChange}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cpf">
                  {tipoUsuario === "EMPRESA_PARCEIRA"
                    ? "CPF do responsável"
                    : "CPF"}
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={form.cpf}
                  onChange={handleCpfChange}
                  onBlur={() =>
                    setErroCpf(
                      form.cpf && !validarCpf(form.cpf)
                        ? "CPF inválido."
                        : ""
                    )
                  }
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
                {erroCpf && (
                  <small className="cadastro-error">{erroCpf}</small>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={
                  tipoUsuario === "EMPRESA_PARCEIRA"
                    ? "E-mail de contato da empresa"
                    : "Digite seu e-mail"
                }
                required
              />
            </div>
          </div>

          {tipoUsuario === "EMPRESA_PARCEIRA" && (
            <div className="cadastro-section gestor-section">
              <h2>Dados da empresa</h2>

              <div className="cadastro-field">
                <label htmlFor="cnpj">CNPJ</label>
                <input
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  value={form.cnpj}
                  onChange={handleCnpjChange}
                  onBlur={() =>
                    setErroCnpj(
                      form.cnpj && !validarCnpj(form.cnpj)
                        ? "CNPJ inválido."
                        : ""
                    )
                  }
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  required
                />
                {erroCnpj && (
                  <small className="cadastro-error">{erroCnpj}</small>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="razaoSocial">Razão social</label>
                <input
                  id="razaoSocial"
                  name="razaoSocial"
                  type="text"
                  value={form.razaoSocial}
                  onChange={handleChange}
                  placeholder="Razão social da empresa"
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="nomeFantasia">Nome fantasia</label>
                <input
                  id="nomeFantasia"
                  name="nomeFantasia"
                  type="text"
                  value={form.nomeFantasia}
                  onChange={handleChange}
                  placeholder="Nome comercial da empresa"
                />
              </div>
            </div>
          )}

          <div className="cadastro-section">
            <h2>
              {tipoUsuario === "EMPRESA_PARCEIRA"
                ? "Endereço da empresa"
                : "Endereço"}
            </h2>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  value={form.cep}
                  onChange={handleCepChange}
                  onBlur={(e) => buscarCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
                {buscandoCep && <small>Buscando CEP...</small>}
                {erroCep && (
                  <small className="cadastro-error">{erroCep}</small>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="numero">Número</label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  value={form.numero}
                  onChange={handleChange}
                  placeholder="Número"
                />
              </div>
            </div>

            <div className="cadastro-field">
              <label htmlFor="rua">Rua</label>
              <input
                id="rua"
                name="rua"
                type="text"
                value={form.rua}
                onChange={handleChange}
                placeholder="Rua ou avenida"
                required
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="bairro">Bairro</label>
              <input
                id="bairro"
                name="bairro"
                type="text"
                value={form.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                required
              />
            </div>

            <div className="cadastro-row">
              <div className="cadastro-field">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                  required
                />
              </div>

              <div className="cadastro-field">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  value={form.estado}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength={2}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cadastro-section">
            <h2>Senha</h2>

            <div className="cadastro-field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Crie uma senha"
                minLength={6}
                required
              />
            </div>

            <div className="cadastro-field">
              <label htmlFor="confirmarSenha">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
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
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div className="login-link">
          <span>Já possui uma conta?</span>
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;