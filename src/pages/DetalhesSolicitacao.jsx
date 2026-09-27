import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../services/api";
import "./DetalhesSolicitacao.css";

function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [token, setToken] = useState(null);

  const [solicitacao, setSolicitacao] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [agendando, setAgendando] = useState(false);

  const [erro, setErro] = useState("");
  const [erroFoto, setErroFoto] = useState("");

  const [mostrarAgendamento, setMostrarAgendamento] =
    useState(false);

  const [dataVisita, setDataVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("");

  // ==========================================
  // CARREGAR AUTENTICAÇÃO
  // ==========================================

  useEffect(() => {
    const usuarioSession =
      sessionStorage.getItem("usuarioLogado");

    const tokenSession =
      sessionStorage.getItem("token");

    const usuarioLocal =
      localStorage.getItem("usuarioLogado");

    const tokenLocal =
      localStorage.getItem("token");

    let usuarioSalvo = null;
    let tokenSalvo = null;

    if (usuarioSession && tokenSession) {
      usuarioSalvo = usuarioSession;
      tokenSalvo = tokenSession;
    } else if (usuarioLocal && tokenLocal) {
      usuarioSalvo = usuarioLocal;
      tokenSalvo = tokenLocal;
    }

    if (!usuarioSalvo || !tokenSalvo) {
      sessionStorage.removeItem("usuarioLogado");
      sessionStorage.removeItem("token");

      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("token");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      if (
        usuario.tipo !== "GESTOR" &&
        usuario.tipo !== "BOSS"
      ) {
        navigate("/perfil", {
          replace: true,
        });

        return;
      }

      setUsuarioLogado(usuario);
      setToken(tokenSalvo);
    } catch (error) {
      console.error(
        "Erro ao recuperar autenticação:",
        error
      );

      sessionStorage.removeItem("usuarioLogado");
      sessionStorage.removeItem("token");

      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("token");

      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  // ==========================================
  // CARREGAR SOLICITAÇÃO
  // ==========================================

  useEffect(() => {
    async function carregarSolicitacao() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/api/solicitacoes/${id}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resposta.status === 401) {
          throw new Error(
            "Sua sessão não é válida. Faça login novamente."
          );
        }

        if (resposta.status === 403) {
          throw new Error(
            "Você não possui permissão para acessar esta solicitação."
          );
        }

        if (resposta.status === 404) {
          throw new Error(
            "Solicitação não encontrada."
          );
        }

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar a solicitação."
          );
        }

        const dados = await resposta.json();

        setSolicitacao(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar solicitação:",
          error
        );

        setSolicitacao(null);

        setErro(
          error.message ||
            "Não foi possível carregar os dados da solicitação."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id && token && usuarioLogado) {
      carregarSolicitacao();
    }
  }, [id, token, usuarioLogado]);

  // ==========================================
  // CARREGAR FOTO
  // ==========================================

  useEffect(() => {
    let urlTemporaria = null;

    async function carregarFoto() {
      if (!solicitacao?.possuiFoto) {
        setFotoUrl(null);
        setErroFoto("");
        return;
      }

      try {
        setCarregandoFoto(true);
        setErroFoto("");

        const resposta = await fetch(
          `${API_URL}/api/solicitacoes/${id}/foto`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar a foto."
          );
        }

        const blob = await resposta.blob();

        urlTemporaria =
          URL.createObjectURL(blob);

        setFotoUrl(urlTemporaria);
      } catch (error) {
        console.error(
          "Erro ao carregar foto:",
          error
        );

        setFotoUrl(null);

        setErroFoto(
          "Não foi possível carregar a foto do local."
        );
      } finally {
        setCarregandoFoto(false);
      }
    }

    if (
      solicitacao &&
      token &&
      id
    ) {
      carregarFoto();
    }

    return () => {
      if (urlTemporaria) {
        URL.revokeObjectURL(
          urlTemporaria
        );
      }
    };
  }, [solicitacao?.id, solicitacao?.possuiFoto, token, id]);

  // ==========================================
  // ATUALIZAR STATUS
  // ==========================================

  const atualizarStatus = async (novoStatus) => {
    try {
      setAtualizando(true);

      const resposta = await fetch(
        `${API_URL}/api/solicitacoes/${id}/status?status=${encodeURIComponent(
          novoStatus
        )}`,
        {
          method: "PATCH",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resposta.status === 401) {
        throw new Error(
          "Sua sessão expirou ou não é válida."
        );
      }

      if (resposta.status === 403) {
        throw new Error(
          "Você não possui permissão para alterar esta solicitação."
        );
      }

      if (!resposta.ok) {
        let mensagemErro =
          "Não foi possível atualizar o status.";

        try {
          const erroBackend =
            await resposta.json();

          mensagemErro =
            erroBackend?.message ||
            erroBackend?.mensagem ||
            mensagemErro;
        } catch {
          // mantém mensagem padrão
        }

        throw new Error(mensagemErro);
      }

      const dadosAtualizados =
        await resposta.json();

      setSolicitacao(dadosAtualizados);

      alert(
        `Status atualizado para "${formatarStatus(
          dadosAtualizados.status
        )}" com sucesso!`
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar status:",
        error
      );

      alert(
        error.message ||
          "Não foi possível atualizar a solicitação."
      );
    } finally {
      setAtualizando(false);
    }
  };

  // ==========================================
  // AGENDAR VISITA
  // ==========================================

  const handleAbrirAgendamento = () => {
    if (solicitacao?.dataVisita) {
      const dataAtual =
        new Date(solicitacao.dataVisita);

      if (!Number.isNaN(dataAtual.getTime())) {
        const ano =
          dataAtual.getFullYear();

        const mes = String(
          dataAtual.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
          dataAtual.getDate()
        ).padStart(2, "0");

        const hora = String(
          dataAtual.getHours()
        ).padStart(2, "0");

        const minuto = String(
          dataAtual.getMinutes()
        ).padStart(2, "0");

        setDataVisita(
          `${ano}-${mes}-${dia}`
        );

        setHoraVisita(
          `${hora}:${minuto}`
        );
      }
    }

    setMostrarAgendamento(true);
  };

  const handleCancelarAgendamento = () => {
    setMostrarAgendamento(false);
    setDataVisita("");
    setHoraVisita("");
  };

  const handleAgendarVisita = async (event) => {
    event.preventDefault();

    if (!dataVisita || !horaVisita) {
      alert(
        "Informe a data e o horário da visita."
      );

      return;
    }

    const dataHoraVisita =
      `${dataVisita}T${horaVisita}:00`;

    const dataSelecionada =
      new Date(dataHoraVisita);

    if (
      Number.isNaN(
        dataSelecionada.getTime()
      )
    ) {
      alert(
        "Informe uma data e um horário válidos."
      );

      return;
    }

    if (
      dataSelecionada.getTime() <=
      Date.now()
    ) {
      alert(
        "A visita deve ser agendada para uma data e horário futuros."
      );

      return;
    }

    try {
      setAgendando(true);

      const resposta = await fetch(
        `${API_URL}/api/solicitacoes/${id}/agendar-visita`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            dataVisita: dataHoraVisita,
          }),
        }
      );

      if (resposta.status === 401) {
        throw new Error(
          "Sua sessão expirou ou não é válida."
        );
      }

      if (resposta.status === 403) {
        throw new Error(
          "Você não possui permissão para agendar a visita desta solicitação."
        );
      }

      if (resposta.status === 404) {
        throw new Error(
          "Solicitação não encontrada."
        );
      }

      if (!resposta.ok) {
        let mensagemErro =
          "Não foi possível agendar a visita.";

        try {
          const erroBackend =
            await resposta.json();

          mensagemErro =
            erroBackend?.message ||
            erroBackend?.mensagem ||
            mensagemErro;
        } catch {
          // mantém mensagem padrão
        }

        throw new Error(mensagemErro);
      }

      const dadosAtualizados =
        await resposta.json();

      setSolicitacao(dadosAtualizados);

      setMostrarAgendamento(false);
      setDataVisita("");
      setHoraVisita("");

      alert(
        "Visita agendada com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao agendar visita:",
        error
      );

      alert(
        error.message ||
          "Não foi possível agendar a visita."
      );
    } finally {
      setAgendando(false);
    }
  };

  // ==========================================
  // AÇÕES
  // ==========================================

  const handleAprovar = () => {
    atualizarStatus("APROVADO");
  };

  const handleRecusar = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja recusar esta solicitação?"
    );

    if (!confirmar) {
      return;
    }

    atualizarStatus("RECUSADO");
  };

  const handleAnalise = () => {
    atualizarStatus("EM_ANALISE");
  };

  // ==========================================
  // FORMATAR STATUS
  // ==========================================

  const formatarStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";

      case "EM_ANALISE":
        return "Em análise";

      case "VISITA_AGENDADA":
        return "Visita agendada";

      case "APROVADO":
        return "Aprovado";

      case "RECUSADO":
        return "Recusado";

      case "CONCLUIDO":
        return "Concluído";

      default:
        return status || "Pendente";
    }
  };

  // ==========================================
  // FORMATAR DATA
  // ==========================================

  const formatarData = (data) => {
    if (!data) {
      return "Não informada";
    }

    const dataFormatada =
      new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return data;
    }

    return dataFormatada.toLocaleDateString(
      "pt-BR"
    );
  };

  // ==========================================
  // FORMATAR DATA E HORA
  // ==========================================

  const formatarDataHora = (data) => {
    if (!data) {
      return "Não agendada";
    }

    const dataFormatada =
      new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return data;
    }

    return dataFormatada.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // DATA MÍNIMA PARA AGENDAMENTO
  // ==========================================

  const obterDataMinima = () => {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      hoje.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  // ==========================================
  // CARREGANDO
  // ==========================================

  if (
    !usuarioLogado ||
    !token ||
    carregando
  ) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container">
          <p>
            Carregando solicitação...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERRO
  // ==========================================

  if (erro || !solicitacao) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container">
          <Link
            to="/gestor"
            className="detalhes-voltar"
          >
            ← Voltar para o painel
          </Link>

          <p>
            {erro ||
              "Solicitação não encontrada."}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // PÁGINA
  // ==========================================

  return (
    <main className="detalhes-page">
      <div className="detalhes-container">

        <Link
          to="/gestor"
          className="detalhes-voltar"
        >
          ← Voltar para o painel
        </Link>

        {/* TOPO */}

        <section className="detalhes-topo">
          <div>
            <span className="detalhes-label">
              Solicitação de plantio
            </span>

            <h1>
              {solicitacao.protocolo}
            </h1>

            <p>
              Enviada em{" "}
              {formatarData(
                solicitacao.dataSolicitacao
              )}
            </p>
          </div>

          <span
            className={`detalhes-status status-${(
              solicitacao.status ||
              "PENDENTE"
            ).toLowerCase()}`}
          >
            {formatarStatus(
              solicitacao.status
            )}
          </span>
        </section>

        {/* DADOS DO SOLICITANTE + ENDEREÇO */}

        <section className="detalhes-grid">

          <div className="detalhes-card">
            <h2>
              Dados do solicitante
            </h2>

            <div className="detalhes-informacoes">

              <div className="detalhes-item">
                <span>
                  Nome completo
                </span>

                <strong>
                  {solicitacao.nomeCompleto ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>CPF</span>

                <strong>
                  {solicitacao.cpf ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>E-mail</span>

                <strong>
                  {solicitacao.email ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Telefone</span>

                <strong>
                  {solicitacao.telefone ||
                    "Não informado"}
                </strong>
              </div>

            </div>
          </div>

          <div className="detalhes-card">
            <h2>
              Endereço do plantio
            </h2>

            <div className="detalhes-informacoes">

              <div className="detalhes-item">
                <span>CEP</span>

                <strong>
                  {solicitacao.cep ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Bairro</span>

                <strong>
                  {solicitacao.bairro ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item detalhes-item-largo">
                <span>
                  Rua / Avenida
                </span>

                <strong>
                  {solicitacao.ruaAvenida ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Número</span>

                <strong>
                  {solicitacao.numero ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>
                  Ponto de referência
                </span>

                <strong>
                  {solicitacao.pontoReferencia ||
                    "Não informado"}
                </strong>
              </div>

            </div>
          </div>

        </section>

        {/* INFORMAÇÕES DA SOLICITAÇÃO */}

        <section className="detalhes-card detalhes-plantio">
          <h2>
            Informações da solicitação
          </h2>

          <div className="detalhes-informacoes">

            <div className="detalhes-item">
              <span>
                ID da solicitação
              </span>

              <strong>
                {solicitacao.id}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>Protocolo</span>

              <strong>
                {solicitacao.protocolo}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>Status atual</span>

              <strong>
                {formatarStatus(
                  solicitacao.status
                )}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>
                Data da solicitação
              </span>

              <strong>
                {formatarData(
                  solicitacao.dataSolicitacao
                )}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>
                Tipo do local
              </span>

              <strong>
                {solicitacao.tipoLocal ||
                  "Não informado"}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>
                Possui foto
              </span>

              <strong>
                {solicitacao.possuiFoto
                  ? "Sim"
                  : "Não"}
              </strong>
            </div>

            {solicitacao.dataVisita && (
              <div className="detalhes-item detalhes-visita-item">
                <span>
                  Visita técnica
                </span>

                <strong>
                  {formatarDataHora(
                    solicitacao.dataVisita
                  )}
                </strong>
              </div>
            )}

            <div className="detalhes-item detalhes-item-largo">
              <span>Observações</span>

              <p>
                {solicitacao.observacoes ||
                  "Nenhuma observação informada."}
              </p>
            </div>

          </div>
        </section>

        {/* VISITA AGENDADA */}

        {solicitacao.dataVisita && (
          <section className="detalhes-card detalhes-visita-agendada">
            <div className="detalhes-visita-icone">
              📅
            </div>

            <div>
              <span className="detalhes-visita-label">
                Visita técnica agendada
              </span>

              <h2>
                {formatarDataHora(
                  solicitacao.dataVisita
                )}
              </h2>

              <p>
                A visita técnica está registrada
                para esta solicitação.
              </p>
            </div>
          </section>
        )}

        {/* FOTO */}

        <section className="detalhes-card">
          <h2>Foto do local</h2>

          <div className="detalhes-foto">

            {carregandoFoto && (
              <div className="detalhes-foto-placeholder">
                <span>📷</span>

                <p>
                  Carregando foto...
                </p>
              </div>
            )}

            {!carregandoFoto &&
              fotoUrl && (
                <img
                  src={fotoUrl}
                  alt="Local solicitado para o plantio"
                  className="detalhes-foto-imagem"
                />
              )}

            {!carregandoFoto &&
              !fotoUrl && (
                <div className="detalhes-foto-placeholder">
                  <span>📷</span>

                  <p>
                    {erroFoto ||
                      (solicitacao.possuiFoto
                        ? "Foto indisponível."
                        : "Esta solicitação não possui foto.")}
                  </p>
                </div>
              )}

          </div>
        </section>

        {/* AGENDAMENTO */}

        {mostrarAgendamento && (
          <section className="detalhes-card detalhes-agendamento">
            <div className="detalhes-agendamento-cabecalho">
              <div>
                <span className="detalhes-label">
                  Visita técnica
                </span>

                <h2>
                  Agendar visita
                </h2>

                <p>
                  Escolha a data e o horário para
                  realizar a visita ao local.
                </p>
              </div>

              <button
                type="button"
                className="detalhes-fechar-agendamento"
                onClick={
                  handleCancelarAgendamento
                }
                disabled={agendando}
                aria-label="Fechar agendamento"
              >
                ×
              </button>
            </div>

            <form
              className="detalhes-agendamento-form"
              onSubmit={
                handleAgendarVisita
              }
            >
              <div className="detalhes-agendamento-campo">
                <label htmlFor="dataVisita">
                  Data da visita
                </label>

                <input
                  id="dataVisita"
                  type="date"
                  min={obterDataMinima()}
                  value={dataVisita}
                  onChange={(event) =>
                    setDataVisita(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="detalhes-agendamento-campo">
                <label htmlFor="horaVisita">
                  Horário
                </label>

                <input
                  id="horaVisita"
                  type="time"
                  value={horaVisita}
                  onChange={(event) =>
                    setHoraVisita(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="detalhes-agendamento-botoes">
                <button
                  type="button"
                  className="detalhes-agendamento-cancelar"
                  onClick={
                    handleCancelarAgendamento
                  }
                  disabled={agendando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="detalhes-agendamento-confirmar"
                  disabled={agendando}
                >
                  {agendando
                    ? "Agendando..."
                    : solicitacao.dataVisita
                      ? "Reagendar visita"
                      : "Confirmar agendamento"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* DECISÃO */}

        <section className="detalhes-card detalhes-decisao">

          <div>
            <h2>
              Análise da solicitação
            </h2>

            <p>
              Atualize o status após analisar as
              informações e a foto enviada pelo
              cidadão.
            </p>
          </div>

          <div className="detalhes-acoes">

            <button
              type="button"
              className="detalhes-btn detalhes-analise"
              onClick={handleAnalise}
              disabled={
                atualizando ||
                agendando ||
                solicitacao.status ===
                  "EM_ANALISE"
              }
            >
              {atualizando
                ? "Atualizando..."
                : "Colocar em análise"}
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-agendar"
              onClick={
                handleAbrirAgendamento
              }
              disabled={
                atualizando ||
                agendando
              }
            >
              {solicitacao.dataVisita
                ? "Reagendar visita"
                : "Agendar visita"}
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-recusar"
              onClick={handleRecusar}
              disabled={
                atualizando ||
                agendando ||
                solicitacao.status ===
                  "RECUSADO"
              }
            >
              Recusar
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-aprovar"
              onClick={handleAprovar}
              disabled={
                atualizando ||
                agendando ||
                solicitacao.status ===
                  "APROVADO"
              }
            >
              Aprovar solicitação
            </button>

          </div>
        </section>

      </div>
    </main>
  );
}

export default DetalhesSolicitacao;