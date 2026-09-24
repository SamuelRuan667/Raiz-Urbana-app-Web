import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminSolicitacoes.css";

function AdminSolicitacoes() {
  const [filtroStatus, setFiltroStatus] = useState("TODAS");
  const [busca, setBusca] = useState("");

  const [solicitacoes] = useState([
    {
      id: 1,
      protocolo: "2026000001",
      nomeCompleto: "Usuário Exemplo",
      bairro: "Boa Viagem",
      ruaAvenida: "Avenida Exemplo",
      status: "PENDENTE",
      dataSolicitacao: "24/09/2026",
    },
    {
      id: 2,
      protocolo: "2026000002",
      nomeCompleto: "Usuário Teste",
      bairro: "Casa Amarela",
      ruaAvenida: "Rua Exemplo",
      status: "EM_ANALISE",
      dataSolicitacao: "23/09/2026",
    },
    {
      id: 3,
      protocolo: "2026000003",
      nomeCompleto: "Usuário Concluído",
      bairro: "Madalena",
      ruaAvenida: "Rua das Árvores",
      status: "CONCLUIDO",
      dataSolicitacao: "22/09/2026",
    },
  ]);

  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "EM_ANALISE":
        return "Em análise";
      case "VISITA_AGENDADA":
        return "Visita agendada";
      case "APROVADO":
        return "Aprovado";
      case "CONCLUIDO":
        return "Concluído";
      case "RECUSADO":
        return "Recusado";
      default:
        return status;
    }
  };

  const classeStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "status-pendente";

      case "EM_ANALISE":
      case "VISITA_AGENDADA":
        return "status-analise";

      case "APROVADO":
      case "CONCLUIDO":
        return "status-concluido";

      case "RECUSADO":
        return "status-recusado";

      default:
        return "";
    }
  };

  const totalPendentes = solicitacoes.filter(
    (item) => item.status === "PENDENTE"
  ).length;

  const totalAnalise = solicitacoes.filter(
    (item) =>
      item.status === "EM_ANALISE" ||
      item.status === "VISITA_AGENDADA"
  ).length;

  const totalConcluidas = solicitacoes.filter(
    (item) =>
      item.status === "CONCLUIDO" ||
      item.status === "APROVADO"
  ).length;

  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const correspondeStatus =
      filtroStatus === "TODAS" ||
      item.status === filtroStatus ||
      (filtroStatus === "ANALISE" &&
        (item.status === "EM_ANALISE" ||
          item.status === "VISITA_AGENDADA")) ||
      (filtroStatus === "CONCLUIDAS" &&
        (item.status === "CONCLUIDO" ||
          item.status === "APROVADO"));

    const termo = busca.toLowerCase().trim();

    const correspondeBusca =
      termo === "" ||
      item.protocolo.toLowerCase().includes(termo) ||
      item.nomeCompleto.toLowerCase().includes(termo) ||
      item.bairro.toLowerCase().includes(termo) ||
      item.ruaAvenida.toLowerCase().includes(termo);

    return correspondeStatus && correspondeBusca;
  });

  return (
    <main className="admin-solicitacoes-page">
      <div className="admin-solicitacoes-container">
        <div className="admin-solicitacoes-voltar">
          <Link to="/admin">
            ← Voltar ao painel
          </Link>
        </div>

        <section className="admin-solicitacoes-topo">
          <span className="admin-solicitacoes-label">
            Arborização
          </span>

          <h1>Solicitações de plantio</h1>

          <p>
            Acompanhe as solicitações de plantio realizadas em
            todos os bairros da plataforma.
          </p>
        </section>

        <section className="admin-solicitacoes-resumo">
          <div className="admin-solicitacoes-resumo-card">
            <div className="admin-solicitacoes-resumo-icon">
              🌱
            </div>

            <div>
              <strong>{solicitacoes.length}</strong>
              <span>Total</span>
            </div>
          </div>

          <div className="admin-solicitacoes-resumo-card">
            <div className="admin-solicitacoes-resumo-icon">
              ⏳
            </div>

            <div>
              <strong>{totalPendentes}</strong>
              <span>Pendentes</span>
            </div>
          </div>

          <div className="admin-solicitacoes-resumo-card">
            <div className="admin-solicitacoes-resumo-icon">
              🔎
            </div>

            <div>
              <strong>{totalAnalise}</strong>
              <span>Em análise</span>
            </div>
          </div>

          <div className="admin-solicitacoes-resumo-card">
            <div className="admin-solicitacoes-resumo-icon">
              🌳
            </div>

            <div>
              <strong>{totalConcluidas}</strong>
              <span>Concluídas</span>
            </div>
          </div>
        </section>

        <section className="admin-solicitacoes-card">
          <div className="admin-solicitacoes-ferramentas">
            <div className="admin-solicitacoes-busca">
              <label htmlFor="buscaSolicitacao">
                Buscar solicitação
              </label>

              <input
                id="buscaSolicitacao"
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Protocolo, usuário, bairro ou rua"
              />
            </div>

            <div className="admin-solicitacoes-filtros">
              <button
                type="button"
                className={
                  filtroStatus === "TODAS" ? "ativo" : ""
                }
                onClick={() => setFiltroStatus("TODAS")}
              >
                Todas
              </button>

              <button
                type="button"
                className={
                  filtroStatus === "PENDENTE" ? "ativo" : ""
                }
                onClick={() => setFiltroStatus("PENDENTE")}
              >
                Pendentes
              </button>

              <button
                type="button"
                className={
                  filtroStatus === "ANALISE" ? "ativo" : ""
                }
                onClick={() => setFiltroStatus("ANALISE")}
              >
                Em análise
              </button>

              <button
                type="button"
                className={
                  filtroStatus === "CONCLUIDAS" ? "ativo" : ""
                }
                onClick={() => setFiltroStatus("CONCLUIDAS")}
              >
                Concluídas
              </button>

              <button
                type="button"
                className={
                  filtroStatus === "RECUSADO" ? "ativo" : ""
                }
                onClick={() => setFiltroStatus("RECUSADO")}
              >
                Recusadas
              </button>
            </div>
          </div>

          <div className="admin-solicitacoes-lista">
            {solicitacoesFiltradas.length === 0 && (
              <div className="admin-solicitacoes-vazio">
                Nenhuma solicitação encontrada.
              </div>
            )}

            {solicitacoesFiltradas.map((item) => (
              <article
                key={item.id}
                className="admin-solicitacao-item"
              >
                <div className="admin-solicitacao-principal">
                  <div className="admin-solicitacao-icon">
                    🌱
                  </div>

                  <div>
                    <span>Protocolo</span>
                    <h3>{item.protocolo}</h3>
                    <p>{item.nomeCompleto}</p>
                  </div>
                </div>

                <div className="admin-solicitacao-dado">
                  <span>Bairro</span>
                  <strong>{item.bairro}</strong>
                </div>

                <div className="admin-solicitacao-dado">
                  <span>Local</span>
                  <strong>{item.ruaAvenida}</strong>
                </div>

                <div className="admin-solicitacao-dado">
                  <span>Data</span>
                  <strong>{item.dataSolicitacao}</strong>
                </div>

                <div className="admin-solicitacao-final">
                  <span
                    className={`admin-solicitacao-status ${classeStatus(
                      item.status
                    )}`}
                  >
                    {traduzirStatus(item.status)}
                  </span>

                  <Link
                    to={`/admin/solicitacoes/${item.id}`}
                    className="admin-solicitacao-visualizar"
                  >
                    Visualizar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminSolicitacoes;