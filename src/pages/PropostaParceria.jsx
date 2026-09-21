import { useState } from "react";
import { Link } from "react-router-dom";
import "./PropostaParceria.css";

function PropostaParceria() {
  const [form, setForm] = useState({
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
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const somenteNumeros = (valor) => {
    return valor.replace(/\D/g, "");
  };

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

    if (numeros.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(numeros)) {
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
      return;
    }

    try {
      setBuscandoCep(true);

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar CEP.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        alert("CEP não encontrado.");

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
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch (erro) {
      console.error("Erro ao consultar CEP:", erro);

      alert(
        "Não foi possível consultar o CEP. Tente novamente."
      );
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
        rua:
          cepNumeros.length === 8
            ? anterior.rua
            : "",
        bairro:
          cepNumeros.length === 8
            ? anterior.bairro
            : "",
        cidade:
          cepNumeros.length === 8
            ? anterior.cidade
            : "",
        estado:
          cepNumeros.length === 8
            ? anterior.estado
            : "",
      }));

      if (cepNumeros.length === 8) {
        buscarCEP(cepNumeros);
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

    if (!validarCNPJ(form.cnpj)) {
      alert("Informe um CNPJ válido.");
      return;
    }

    if (somenteNumeros(form.cep).length !== 8) {
      alert("Informe um CEP válido.");
      return;
    }

    if (
      !form.rua ||
      !form.bairro ||
      !form.cidade ||
      !form.estado
    ) {
      alert("Informe um CEP válido.");
      return;
    }

    if (!form.termos) {
      alert(
        "Você precisa aceitar os termos para enviar a proposta."
      );
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

      console.log(
        "Proposta preparada:",
        dadosProposta
      );

      alert(
        "Formulário preenchido com sucesso. Na próxima etapa vamos conectar o envio ao backend."
      );
    } catch (erro) {
      console.error(
        "Erro ao preparar proposta:",
        erro
      );

      alert(
        "Não foi possível preparar a proposta."
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

        <form
          className="proposta-parceria-form"
          onSubmit={handleSubmit}
        >

          <section className="proposta-parceria-card">
            <h2>Dados da empresa</h2>

            <div className="proposta-parceria-grid">

              <div className="proposta-parceria-field">
                <label htmlFor="razaoSocial">
                  Razão Social
                </label>

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
                <label htmlFor="nomeFantasia">
                  Nome Fantasia
                </label>

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
                <label htmlFor="cnpj">
                  CNPJ
                </label>

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
                <label htmlFor="email">
                  E-mail
                </label>

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
                <label htmlFor="telefone">
                  Telefone
                </label>

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
                <label htmlFor="cep">
                  CEP
                </label>

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
                  <small>
                    Buscando endereço...
                  </small>
                )}
              </div>

              <div className="proposta-parceria-field">
                <label htmlFor="numero">
                  Número
                </label>

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
                <label htmlFor="rua">
                  Rua / Avenida
                </label>

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
                <label htmlFor="bairro">
                  Bairro
                </label>

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
                <label htmlFor="cidade">
                  Cidade
                </label>

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
                <label htmlFor="estado">
                  Estado
                </label>

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
                  <option value="">
                    Selecione uma opção
                  </option>

                  <option value="BENEFICIOS">
                    Benefícios e descontos
                  </option>

                  <option value="PATROCINIO">
                    Patrocínio
                  </option>

                  <option value="APOIO_AMBIENTAL">
                    Apoio a ações ambientais
                  </option>

                  <option value="DOACAO">
                    Doação de materiais ou recursos
                  </option>

                  <option value="OUTRO">
                    Outro
                  </option>
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
              />

              <span>
                Confirmo que as informações fornecidas são
                verdadeiras e autorizo a equipe do Raiz Urbana a
                entrar em contato para analisar esta proposta.
              </span>
            </label>
          </section>

          <div className="proposta-parceria-acoes">
            <Link
              to="/parcerias"
              className="proposta-cancelar"
            >
              Voltar
            </Link>

            <button
              type="submit"
              className="proposta-enviar"
              disabled={enviando || buscandoCep}
            >
              {enviando
                ? "Enviando..."
                : "Enviar proposta"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default PropostaParceria;