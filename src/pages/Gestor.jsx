import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Gestor.css";

function Gestor() {
  const navigate = useNavigate();

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [token, setToken] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // =========================
  // CARREGAR AUTENTICAÇÃO
  // =========================

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

      if (!usuario.id) {
        throw new Error(
          "Usuário autenticado sem ID."
        );
      }

      setUsuarioLogado(usuario);
      setToken(tokenSalvo);
    } catch (error) {
      console.error(
        "Erro ao recuperar usuário logado:",
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

  // =========================
  // CARREGAR SOLICITAÇÕES
  // =========================

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/api/solicitacoes/gestor/${usuarioLogado.id}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          resposta.status === 401 ||
          resposta.status === 403
        ) {
          throw new Error(
            "Você não possui permissão para acessar as solicitações."
          );
        }

        if (!resposta.ok) {
          let mensagem =
            "Não foi possível carregar as solicitações.";

          try {
            const dadosErro = await resposta.json();

            mensagem =
              dadosErro?.message ||
              dadosErro?.mensagem ||
              mensagem;
          } catch {
            // Mantém a mensagem padrão.
          }

          throw new Error(mensagem);
        }

        const dados = await resposta.json();

        setSolicitacoes(
          Array.isArray(dados) ? dados : []
        );
      } catch (error) {
        console.error(
          "Erro ao carregar solicitações:",
          error
        );

        setSolicitacoes([]);

        setErro(
          error.message ||
            "Não foi possível carregar as solicitações."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (usuarioLogado && token) {
      carregarSolicitacoes();
    }
  }, [usuarioLogado, token]);

  // =========================
  // SAIR DA CONTA
  // =========================

  const sairDaConta = () => {
    sessionStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("token");

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    window.dispatchEvent(
      new Event("usuarioLogadoAtualizado")
    );

    navigate("/login", {
      replace: true,
    });
  };

  // =========================
  // FORMATAR STATUS
  // =========================

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

  // =========================
  // FORMATAR DATA
  // =========================

  const formatarData = (data) => {
    if (!data) {
      return "Não informada";
    }

    const dataFormatada = new Date(data);

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

  // =========================
  // CONTADORES
  // =========================

  const totalSolicitacoes =
    solicitacoes.length;

  const totalPendentes =
    solicitacoes.filter(
      (solicitacao) =>
        solicitacao.status === "PENDENTE"
    ).length;

  const totalEmAnalise =
    solicitacoes.filter(
      (solicitacao) =>
        solicitacao.status === "EM_ANALISE" ||
        solicitacao.status ===
          "VISITA_AGENDADA"
    ).length;

  const totalAprovadas =
    solicitacoes.filter(
      (solicitacao) =>
        solicitacao.status === "APROVADO" ||
        solicitacao.status === "CONCLUIDO"
    ).length;

  if (!usuarioLogado || !token) {
    return null;
  }

  return (
    <main className="gestor-page">
      <div className="gestor-container">

        {/* =========================
            TOPO
        ========================== */}

        <section className="gestor-topo">
          <div>
            <span className="gestor-label">
              Área administrativa
            </span>

            <h1>Painel do Gestor</h1>

            <p>
              Acompanhe e analise as solicitações de
              plantio enviadas pelos cidadãos.
            </p>
          </div>

          <div className="gestor-topo-acoes">
            <div className="gestor-perfil">
              <div className="gestor-avatar">
                👤
              </div>

              <div>
                <strong>
                  {usuarioLogado.nomeCompleto ||
                    "Gestor"}
                </strong>

                <span>
                  {usuarioLogado.tipo === "BOSS"
                    ? "BOSS"
                    : "Gestor"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="gestor-sair"
              onClick={sairDaConta}
            >
              Sair da conta
            </button>
          </div>
        </section>

        {/* =========================
            RESUMO
        ========================== */}

        <section className="gestor-resumo">
          <div className="gestor-resumo-card">
            <span>
              Total de solicitações
            </span>

            <strong>
              {carregando
                ? "..."
                : totalSolicitacoes}
            </strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Pendentes</span>

            <strong>
              {carregando
                ? "..."
                : totalPendentes}
            </strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Em análise</span>

            <strong>
              {carregando
                ? "..."
                : totalEmAnalise}
            </strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Aprovadas</span>

            <strong>
              {carregando
                ? "..."
                : totalAprovadas}
            </strong>
          </div>
        </section>

        {/* =========================
            LISTA DE SOLICITAÇÕES
        ========================== */}

        <section className="gestor-lista-card">
          <div className="gestor-lista-header">
            <div>
              <h2>
                Solicitações recentes
              </h2>

              <p>
                Clique em uma solicitação para
                visualizar todos os detalhes.
              </p>
            </div>
          </div>

          {carregando && (
            <p
              style={{
                color: "#687168",
                padding: "20px 0",
              }}
            >
              Carregando solicitações...
            </p>
          )}

          {!carregando && erro && (
            <p
              style={{
                color: "#a64b4b",
                padding: "20px 0",
              }}
            >
              {erro}
            </p>
          )}

          {!carregando &&
            !erro &&
            solicitacoes.length === 0 && (
              <p
                style={{
                  color: "#687168",
                  padding: "20px 0",
                }}
              >
                Nenhuma solicitação encontrada.
              </p>
            )}

          {!carregando &&
            !erro &&
            solicitacoes.length > 0 && (
              <div className="gestor-tabela-wrapper">
                <table className="gestor-tabela">
                  <thead>
                    <tr>
                      <th>Protocolo</th>
                      <th>Solicitante</th>
                      <th>Bairro</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {solicitacoes.map(
                      (solicitacao) => (
                        <tr
                          key={
                            solicitacao.id
                          }
                        >
                          <td>
                            <strong className="gestor-protocolo">
                              {
                                solicitacao.protocolo
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              solicitacao.nomeCompleto
                            }
                          </td>

                          <td>
                            {
                              solicitacao.bairro
                            }
                          </td>

                          <td>
                            {formatarData(
                              solicitacao.dataSolicitacao
                            )}
                          </td>

                          <td>
                            <span
                              className={`gestor-status status-${(
                                solicitacao.status ||
                                "PENDENTE"
                              ).toLowerCase()}`}
                            >
                              {formatarStatus(
                                solicitacao.status
                              )}
                            </span>
                          </td>

                          <td>
                            <Link
                              to={`/gestor/solicitacao/${solicitacao.id}`}
                              className="gestor-ver"
                            >
                              Ver detalhes
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default Gestor;