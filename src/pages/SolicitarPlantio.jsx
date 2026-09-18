import { useState } from "react";
import API_URL from "../services/api";
import "./SolicitarPlantio.css";

function SolicitarPlantio() {
  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    referencia: "",
    tipoLocal: "Calçada em frente à residência",
    observacoes: "",
    foto: null,
  });

  const [carregandoCep, setCarregandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  // =========================
  // MÁSCARAS
  // =========================

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 9) {
      return valor.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    }

    if (valor.length > 6) {
      return valor.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    }

    if (valor.length > 3) {
      return valor.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    return valor;
  };

  const formatarTelefone = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 10) {
      return valor.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
      );
    }

    if (valor.length > 6) {
      return valor.replace(
        /(\d{2})(\d{4,5})(\d{1,4})/,
        "($1) $2-$3"
      );
    }

    if (valor.length > 2) {
      return valor.replace(/(\d{2})(\d{1,5})/, "($1) $2");
    }

    return valor;
  };

  const formatarCEP = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 8);

    if (valor.length > 5) {
      return valor.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    }

    return valor;
  };

  // =========================
  // ALTERAÇÃO DOS CAMPOS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let valorFormatado = value;

    if (name === "cpf") {
      valorFormatado = formatarCPF(value);
    }

    if (name === "telefone") {
      valorFormatado = formatarTelefone(value);
    }

    if (name === "cep") {
      valorFormatado = formatarCEP(value);
      setErroCep("");
    }

    setFormulario((anterior) => ({
      ...anterior,
      [name]: valorFormatado,
    }));

    // Busca o endereço quando o CEP estiver completo
    if (name === "cep" && valorFormatado.replace(/\D/g, "").length === 8) {
      buscarCEP(valorFormatado);
    }
  };

  // =========================
  // VIA CEP
  // =========================

  const buscarCEP = async (cep) => {
    const cepNumeros = cep.replace(/\D/g, "");

    if (cepNumeros.length !== 8) {
      return;
    }

    setCarregandoCep(true);
    setErroCep("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepNumeros}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Erro na consulta do CEP");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErroCep("CEP não encontrado.");
        setFormulario((anterior) => ({
          ...anterior,
          rua: "",
          bairro: "",
        }));
        return;
      }

      setFormulario((anterior) => ({
        ...anterior,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
      }));
    } catch (erro) {
      console.error("Erro ao consultar CEP:", erro);
      setErroCep("Não foi possível consultar o CEP.");
    } finally {
      setCarregandoCep(false);
    }
  };

  // =========================
  // FOTO
  // =========================

  const handleFoto = (e) => {
    const arquivo = e.target.files[0];

    if (arquivo) {
      setFormulario((anterior) => ({
        ...anterior,
        foto: arquivo,
      }));
    }
  };

  // =========================
  // ENVIO DO FORMULÁRIO COM INTEGRAÇÃO
  // =========================

  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.foto) {
      alert("É obrigatório enviar uma foto do local.");
      return;
    }

    setEnviando(true);

    try {
      // 1. Mapeia os campos para os nomes esperados pelo SolicitacaoPlantioRequest.java
      const dadosEnvio = {
        nomeCompleto: formulario.nome,
        cpf: formulario.cpf,
        telefone: formulario.telefone,
        email: formulario.email,
        cep: formulario.cep,
        bairro: formulario.bairro,
        ruaAvenida: formulario.rua,
        numero: formulario.numero || "",
        pontoReferencia: formulario.referencia,
        tipoLocal: formulario.tipoLocal,
        observacoes: formulario.observacoes || ""
      };

      // 2. Prepara o FormData multipart
      const formData = new FormData();
      
      // O Spring espera a parte "dados" como application/json
      formData.append(
        "dados",
        new Blob([JSON.stringify(dadosEnvio)], { type: "application/json" })
      );

      // Anexa o arquivo com a chave "foto"
      formData.append("foto", formulario.foto);

      // 3. Dispara a requisição para o Spring Boot
      const resposta = await fetch(`${API_URL}/api/solicitacoes`, {
        method: "POST",
        body: formData, // O navegador define o multipart/form-data automaticamente
      });

      if (!resposta.ok) {
        const erroMsg = await resposta.text();
        throw new Error(erroMsg || "Erro ao processar solicitação.");
      }

      const respostaJson = await resposta.json();
      
      alert(`🎉 Solicitação cadastrada com sucesso!\nSeu Protocolo é: ${respostaJson.protocolo}`);

      // Limpa o formulário após o sucesso
      setFormulario({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        referencia: "",
        tipoLocal: "Calçada em frente à residência",
        observacoes: "",
        foto: null,
      });

    } catch (erro) {
      console.error("Erro ao enviar para o servidor:", erro);
      alert("Falha ao enviar a solicitação. Verifique o console da aplicação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="solicitar-page">
      {/* =========================
          CABEÇALHO DA PÁGINA
      ========================== */}

      <section className="solicitar-intro">
        <h1>Solicitar Plantio de Árvore</h1>

        <p>
          Preencha o formulário abaixo para solicitar o plantio de uma árvore.
          Nossa equipe técnica analisará o pedido e entrará em contato para
          agendar uma visita ao local.
        </p>
      </section>

      {/* =========================
          AVISO
      ========================== */}

      <section className="novidade-card">
        <div className="novidade-icone">📷</div>

        <div>
          <h2>Novidade!</h2>

          <p>
            Agora você pode enviar uma foto do local diretamente pelo seu
            celular! Isso nos ajuda a avaliar melhor o espaço e agilizar sua
            solicitação.
          </p>
        </div>
      </section>

      {/* =========================
          FORMULÁRIO
      ========================== */}

      <form className="plantio-form" onSubmit={handleSubmit}>

        {/* =========================
            1. DADOS PESSOAIS
        ========================== */}

        <section className="form-section">
          <div className="section-title">
            

            <h2>Dados Pessoais</h2>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="nome">
                Nome Completo <span>*</span>
              </label>

              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome completo"
                value={formulario.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">
                CPF <span>*</span>
              </label>

              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formulario.cpf}
                onChange={handleChange}
                maxLength="14"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">
                Telefone <span>*</span>
              </label>

              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(XX) XXXXX-XXXX"
                value={formulario.telefone}
                onChange={handleChange}
                maxLength="15"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">
                E-mail <span>*</span>
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="seuemail@email.com"
                value={formulario.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* =========================
            2. ENDEREÇO
        ========================== */}

        <section className="form-section">
          <div className="section-title">
            

            <h2>
              <span className="location-icon">📍</span>
              Endereço do Plantio
            </h2>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="cep">
                CEP <span>*</span>
              </label>

              <input
                type="text"
                id="cep"
                name="cep"
                placeholder="00000-000"
                value={formulario.cep}
                onChange={handleChange}
                maxLength="9"
                required
              />

              {carregandoCep && (
                <small className="cep-status">
                  Consultando CEP...
                </small>
              )}

              {erroCep && (
                <small className="cep-erro">
                  {erroCep}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bairro">
                Bairro <span>*</span>
              </label>

              <input
                type="text"
                id="bairro"
                name="bairro"
                placeholder="Bairro"
                value={formulario.bairro}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="rua">
                Rua/Avenida <span>*</span>
              </label>

              <input
                type="text"
                id="rua"
                name="rua"
                placeholder="Rua ou Avenida"
                value={formulario.rua}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero">
                Número
              </label>

              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                value={formulario.numero}
                onChange={handleChange}
              />

              <small className="campo-opcional">
                Campo opcional
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="referencia">
                Ponto de Referência <span>*</span>
              </label>

              <input
                type="text"
                id="referencia"
                name="referencia"
                placeholder="Ex.: próximo à praça"
                value={formulario.referencia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="tipoLocal">
                Tipo do Local <span>*</span>
              </label>

              <select
                id="tipoLocal"
                name="tipoLocal"
                value={formulario.tipoLocal}
                onChange={handleChange}
                required
              >
                <option value="Calçada em frente à residência">
                  Calçada em frente à residência
                </option>

                <option value="Calçada em frente a comércio">
                  Calçada em frente a comércio
                </option>

                <option value="Praça">
                  Praça
                </option>

                <option value="Parque">
                  Parque
                </option>

                <option value="Área pública">
                  Área pública
                </option>

                <option value="Outro">
                  Outro
                </option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="observacoes">
                Observações
              </label>

              <textarea
                id="observacoes"
                name="observacoes"
                placeholder="Informações adicionais sobre o local..."
                value={formulario.observacoes}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>
        </section>

        {/* =========================
            3. FOTO
        ========================== */}

        <section className="form-section">
          <div className="section-title">
            

            <h2>
              Foto do Local <span className="required-title">*</span>
            </h2>
          </div>

          <div className="foto-upload">
            <div className="foto-icone">
              📷
            </div>

            <h3>
              Envie uma foto do local
            </h3>

            <p>
              Tire uma foto do local onde deseja o plantio da árvore.
              Isso nos ajuda a avaliar melhor o espaço.
            </p>

            <p className="foto-alerta">
              Este campo é obrigatório para análise da solicitação.
            </p>

            <label
              htmlFor="foto"
              className="btn-capturar"
            >
              📷 Capturar Imagem
            </label>

            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              capture="environment"
              onChange={handleFoto}
              required
            />

            {formulario.foto && (
              <p className="foto-selecionada">
                ✓ Foto selecionada: {formulario.foto.name}
              </p>
            )}
          </div>
        </section>

        {/* =========================
            BOTÃO
        ========================== */}

        <div className="form-footer">
          <p>
            <span>*</span> Campos obrigatórios
          </p>

          <button
            type="submit"
            className="btn-enviar"
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </div>

      </form>
    </main>
  );
}

export default SolicitarPlantio;