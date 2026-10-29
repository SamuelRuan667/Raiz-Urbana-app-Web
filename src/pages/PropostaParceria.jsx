import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./PropostaParceria.css";

const FORM_INICIAL = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  responsavel: "",
  email: "",
  telefone: "",
  cep: "",
  numero: "",
  rua: "",
  bairro: "",
  cidade: "",
  estado: "",
  tipoParceria: "",
  descricao: "",
  termos: false,
};

function PropostaParceria() {
  const navigate = useNavigate();

  const [form, setForm] = useState(FORM_INICIAL);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const somenteNumeros = (valor) => valor.replace(/\D/g, "");

  const formatarCNPJ = (valor) => {
    const numeros = somenteNumeros(valor).slice(0, 14);

    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const formatarCEP = (valor) => {
    const numeros = somenteNumeros(valor).slice(0, 8);
    return numeros.replace(/^(\d{5})(\d)/, "$1-$2");
  };

  const formatarTelefone = (valor) => {
    const numeros = somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const validarCNPJ = (cnpj) => {
    const numeros = somenteNumeros(cnpj);

    if (numeros.length !== 14 || /^(\d)\1+$/.test(numeros)) {
      return false;
    }

    const calcularDigito = (base, pesos) => {
      let soma = 0;

      for (let i = 0; i < pesos.length; i++) {
        soma += Number(base[i]) * pesos[i];
      }

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(
      numeros.substring(0, 12),
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    const segundoDigito = calcularDigito(
      numeros.substring(0, 12) + primeiroDigito,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    return (
      primeiroDigito === Number(numeros[12]) &&
      segundoDigito === Number(numeros[13])
    );
  };

  const buscarCEP = async (cepDigitado) => {
    const cep = somenteNumeros(cepDigitado);

    if (cep.length !== 8) {
      setBuscandoCep(false);
      return;
    }

    setBuscandoCep(true);
    setMensagemErro("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível consultar o CEP.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setForm((anterior) => ({
          ...anterior,
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));

        setMensagemErro("CEP não encontrado. Confira o número informado.");
        return;
      }

      setForm((anterior) => ({
        ...anterior,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch (erro) {
      console.error("Erro ao consultar CEP:", erro);
      setMensagemErro(
        "Não foi possível consultar o CEP. Tente novamente."
      );
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setMensagemErro("");
    setMensagemSucesso("");

    if (type === "checkbox") {
      setForm((anterior) => ({
        ...anterior,
        [name]: checked,
      }));
      return;
    }

    if (name === "cnpj") {
      setForm((anterior) => ({
        ...anterior,
        cnpj: formatarCNPJ(value),
      }));
      return;
    }

    if (name === "telefone") {
      setForm((anterior) => ({
        ...anterior,
        telefone: formatarTelefone(value),
      }));
      return;
    }

    if (name === "cep") {
      const cepFormatado = formatarCEP(value);
      const cepNumeros = somenteNumeros(cepFormatado);

      setForm((anterior) => ({
        ...anterior,
        cep: cepFormatado,
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));

      if (cepNumeros.length === 8) {
        buscarCEP(cepNumeros);
      } else {
        setBuscandoCep(false);
      }

      return;
    }

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagemErro("");
    setMensagemSucesso("");

    if (buscandoCep) {
      setMensagemErro("Aguarde a consulta do CEP terminar.");
      return;
    }

    if (!validarCNPJ(form.cnpj)) {
      setMensagemErro("Informe um CNPJ válido.");
      return;
    }

    if (somenteNumeros(form.cep).length !== 8) {
      setMensagemErro("Informe um CEP válido.");
      return;
    }

    if (
      !form.rua.trim() ||
      !form.bairro.trim() ||
      !form.cidade.trim() ||
      !form.estado.trim()
    ) {
      setMensagemErro(
        "Consulte um CEP válido para preencher o endereço da empresa."
      );
      return;
    }

    if (!form.razaoSocial.trim() || !form.nomeFantasia.trim()) {
      setMensagemErro("Preencha a razão social e o nome fantasia.");
      return;
    }

    if (!form.responsavel.trim() || !form.email.trim()) {
      setMensagemErro("Preencha o responsável e o e-mail da empresa.");
      return;
    }

    if (somenteNumeros(form.telefone).length < 10) {
      setMensagemErro("Informe um telefone válido.");
      return;
    }

    if (!form.tipoParceria || !form.descricao.trim()) {
      setMensagemErro("Informe o tipo e a descrição da parceria.");
      return;
    }

    if (!form.termos) {
      setMensagemErro(
        "Você precisa aceitar os termos para enviar a proposta."
      );
      return;
    }

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setMensagemErro("Sua sessão expirou. Faça login para continuar.");

      navigate("/login", {
        state: { from: "/parcerias/proposta" },
      });

      return;
    }

    try {
      setEnviando(true);

      const dadosProposta = {
        razaoSocial: form.razaoSocial.trim(),
        nomeFantasia: form.nomeFantasia.trim(),
        cnpj: somenteNumeros(form.cnpj),
        responsavel: form.responsavel.trim(),
        email: form.email.trim(),
        telefone: somenteNumeros(form.telefone),
        cep: somenteNumeros(form.cep),
        numero: form.numero.trim(),
        rua: form.rua.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim(),
        tipoParceria: form.tipoParceria,
        descricao: form.descricao.trim(),
      };

      const resposta = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/propostas-parceria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dadosProposta),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        if (resposta.status === 401) {
          throw new Error(
            "Sua sessão expirou. Faça login novamente."
          );
        }

        if (resposta.status === 403) {
          throw new Error(
            "Somente contas de empresas podem enviar propostas de parceria."
          );
        }

        const mensagemServidor =
          resultado.erro ||
          resultado.message ||
          resultado.mensagem ||
          "";

        if (
          resposta.status === 409 ||
          /cnpj.*(exist|cadastrad|duplicad)|cadastrad.*cnpj/i.test(
            mensagemServidor
          )
        ) {
          throw new Error(
            "Já existe uma proposta cadastrada com esse CNPJ. Entre em contato com a equipe do Raiz Urbana se precisar de ajuda."
          );
        }

        throw new Error(
          mensagemServidor ||
            `Não foi possível enviar a proposta (erro ${resposta.status}).`
        );
      }

      setForm(FORM_INICIAL);
      setMensagemSucesso(
        "Sua proposta foi enviada com sucesso! A equipe do Raiz Urbana irá analisá-la. Você poderá acompanhar o andamento no seu perfil."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      console.error("Erro ao enviar proposta:", erro);
      setMensagemErro(
        erro.message || "Não foi possível enviar a proposta."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="proposta-parceria-page">
      <div className="proposta-parceria-container">
        <div className="proposta-parceria-topo">
          <span className="proposta-parceria-label">
            Empresa Parceira
          </span>

          <h1>Proposta de parceria</h1>

          <p>
            Preencha os dados da sua empresa e conte como deseja
            contribuir com o Raiz Urbana.
          </p>
        </div>

        {mensagemSucesso && (
          <div
            className="proposta-mensagem-sucesso"
            role="status"
            aria-live="polite"
          >
            <strong>Proposta recebida!</strong>
            <p>{mensagemSucesso}</p>
            <div className="proposta-mensagem-acoes">
              <Link to="/perfil" className="proposta-enviar">
                Acompanhar no perfil
              </Link>
              <Link to="/" className="proposta-cancelar">
                Voltar ao início
              </Link>
            </div>
          </div>
        )}

        {mensagemErro && (
          <div
            className="proposta-mensagem-erro"
            role="alert"
            aria-live="assertive"
          >
            {mensagemErro}
          </div>
        )}

        {!mensagemSucesso && (
          <form
            className="proposta-parceria-form"
            onSubmit={handleSubmit}
          >
            <section className="proposta-parceria-card">
              <h2>Dados da empresa</h2>

              <div className="proposta-parceria-grid">
                <div className="proposta-parceria-field">
                  <label htmlFor="razaoSocial">Razão Social</label>
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

                <div className="proposta-parceria-field">
                  <label htmlFor="nomeFantasia">Nome Fantasia</label>
                  <input
                    id="nomeFantasia"
                    name="nomeFantasia"
                    type="text"
                    value={form.nomeFantasia}
                    onChange={handleChange}
                    placeholder="Nome fantasia"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={form.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="responsavel">
                    Responsável pela empresa
                  </label>
                  <input
                    id="responsavel"
                    name="responsavel"
                    type="text"
                    value={form.responsavel}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="empresa@email.com"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(81) 99999-9999"
                    maxLength={15}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="proposta-parceria-card">
              <h2>Endereço da empresa</h2>

              <div className="proposta-parceria-grid">
                <div className="proposta-parceria-field">
                  <label htmlFor="cep">CEP</label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />

                  {buscandoCep && (
                    <small>Buscando endereço...</small>
                  )}
                </div>

                <div className="proposta-parceria-field">
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

                <div className="proposta-parceria-field proposta-campo-largo">
                  <label htmlFor="rua">Rua / Avenida</label>
                  <input
                    id="rua"
                    name="rua"
                    type="text"
                    value={form.rua}
                    onChange={handleChange}
                    placeholder="Preenchido pelo CEP"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="bairro">Bairro</label>
                  <input
                    id="bairro"
                    name="bairro"
                    type="text"
                    value={form.bairro}
                    onChange={handleChange}
                    placeholder="Preenchido pelo CEP"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Preenchido pelo CEP"
                    required
                  />
                </div>

                <div className="proposta-parceria-field">
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
            </section>

            <section className="proposta-parceria-card">
              <h2>Proposta de parceria</h2>

              <div className="proposta-parceria-grid">
                <div className="proposta-parceria-field proposta-campo-largo">
                  <label htmlFor="tipoParceria">
                    Tipo de parceria
                  </label>
                  <select
                    id="tipoParceria"
                    name="tipoParceria"
                    value={form.tipoParceria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="BENEFICIOS">
                      Benefícios e descontos
                    </option>
                    <option value="PATROCINIO">Patrocínio</option>
                    <option value="APOIO_AMBIENTAL">
                      Apoio a ações ambientais
                    </option>
                    <option value="DOACAO">
                      Doação de materiais ou recursos
                    </option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div className="proposta-parceria-field proposta-campo-largo">
                  <label htmlFor="descricao">
                    Descrição da proposta
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Explique como sua empresa deseja contribuir com o projeto..."
                    rows={6}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="proposta-parceria-card">
              <label className="proposta-termos">
                <input
                  type="checkbox"
                  name="termos"
                  checked={form.termos}
                  onChange={handleChange}
                  required
                />
                <span>
                  Confirmo que as informações fornecidas são
                  verdadeiras e autorizo a equipe do Raiz Urbana a
                  entrar em contato para analisar esta proposta.
                </span>
              </label>
            </section>

            <div className="proposta-parceria-acoes">
              <Link to="/parcerias" className="proposta-cancelar">
                Voltar
              </Link>

              <button
                type="submit"
                className="proposta-enviar"
                disabled={enviando || buscandoCep}
              >
                {enviando ? "Enviando..." : "Enviar proposta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default PropostaParceria;