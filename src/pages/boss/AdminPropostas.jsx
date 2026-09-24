import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminPropostas.css";

function AdminPropostas() {
  const [filtro, setFiltro] = useState("TODAS");

  const [propostas] = useState([
    {
      id: 1,
      empresa: "Empresa Exemplo",
      cnpj: "00.000.000/0001-00",
      responsavel: "Responsável Exemplo",
      tipo: "Apoio a ações ambientais",
      data: "24/09/2026",
      status: "PENDENTE",
    },
    {
      id: 2,
      empresa: "Parceiro Verde",
      cnpj: "11.111.111/0001-11",
      responsavel: "Responsável Parceiro",
      tipo: "Benefícios e descontos",
      data: "23/09/2026",
      status: "APROVADA",
    },
    {
      id: 3,
      empresa: "Empresa Sustentável",
      cnpj: "22.222.222/0001-22",
      responsavel: "Responsável Sustentável",
      tipo: "Patrocínio",
      data: "22/09/2026",
      status: "RECUSADA",
    },
  ]);

  const propostasFiltradas =
    filtro === "TODAS"
      ? propostas
      : propostas.filter(
          (proposta) => proposta.status === filtro
        );

  const quantidadePendentes = propostas.filter(
    (proposta) => proposta.status === "PENDENTE"
  ).length;

  const quantidadeAprovadas = propostas.filter(
    (proposta) => proposta.status === "APROVADA"
  ).length;

  const quantidadeRecusadas = propostas.filter(
    (proposta) => proposta.status === "RECUSADA"
  ).length;

  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Aguardando análise";

      case "APROVADA":
        return "Aprovada";

      case "RECUSADA":
        return "Recusada";

      default:
        return status;
    }
  };

  const classeStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "admin-propostas-status-pendente";

      case "APROVADA":
        return "admin-propostas-status-aprovada";

      case "RECUSADA":
        return "admin-propostas-status-recusada";

      default:
        return "";
    }
  };

  return (
    <main className="admin-propostas-page">
      <div className="admin-propostas-container">
        <div className="admin-propostas-voltar">
          <Link to="/admin">
            ← Voltar ao painel
          </Link>
        </div>

        <section className="admin-propostas-topo">
          <span className="admin-propostas-label">
            Empresas
          </span>

          <h1>Propostas de parceria</h1>

          <p>
            Analise as propostas enviadas pelas empresas que
            desejam participar do Raiz Urbana.
          </p>
        </section>

        <section className="admin-propostas-resumo">
          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon">
              🤝
            </div>

            <div>
              <strong>{propostas.length}</strong>
              <span>Total de propostas</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon pendente">
              🔎
            </div>

            <div>
              <strong>{quantidadePendentes}</strong>
              <span>Aguardando análise</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon aprovada">
              ✓
            </div>

            <div>
              <strong>{quantidadeAprovadas}</strong>
              <span>Aprovadas</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon recusada">
              ×
            </div>

            <div>
              <strong>{quantidadeRecusadas}</strong>
              <span>Recusadas</span>
            </div>
          </div>
        </section>

        <section className="admin-propostas-conteudo">
          <div className="admin-propostas-header">
            <div>
              <h2>Propostas recebidas</h2>

              <p>
                Selecione uma proposta para visualizar todos os
                detalhes.
              </p>
            </div>

            <div className="admin-propostas-filtros">
              <button
                type="button"
                className={
                  filtro === "TODAS" ? "ativo" : ""
                }
                onClick={() => setFiltro("TODAS")}
              >
                Todas
              </button>

              <button
                type="button"
                className={
                  filtro === "PENDENTE" ? "ativo" : ""
                }
                onClick={() => setFiltro("PENDENTE")}
              >
                Pendentes
              </button>

              <button
                type="button"
                className={
                  filtro === "APROVADA" ? "ativo" : ""
                }
                onClick={() => setFiltro("APROVADA")}
              >
                Aprovadas
              </button>

              <button
                type="button"
                className={
                  filtro === "RECUSADA" ? "ativo" : ""
                }
                onClick={() => setFiltro("RECUSADA")}
              >
                Recusadas
              </button>
            </div>
          </div>

          <div className="admin-propostas-lista">
            {propostasFiltradas.length === 0 && (
              <div className="admin-propostas-vazio">
                Nenhuma proposta encontrada.
              </div>
            )}

            {propostasFiltradas.map((proposta) => (
              <div
                key={proposta.id}
                className="admin-propostas-item"
              >
                <div className="admin-propostas-empresa">
                  <div className="admin-propostas-empresa-icon">
                    🏢
                  </div>

                  <div>
                    <h3>{proposta.empresa}</h3>

                    <p>{proposta.cnpj}</p>
                  </div>
                </div>

                <div className="admin-propostas-dado">
                  <span>Responsável</span>
                  <strong>
                    {proposta.responsavel}
                  </strong>
                </div>

                <div className="admin-propostas-dado">
                  <span>Tipo de parceria</span>
                  <strong>
                    {proposta.tipo}
                  </strong>
                </div>

                <div className="admin-propostas-dado">
                  <span>Enviada em</span>
                  <strong>
                    {proposta.data}
                  </strong>
                </div>

                <div className="admin-propostas-final">
                  <span
                    className={`admin-propostas-status ${classeStatus(
                      proposta.status
                    )}`}
                  >
                    {traduzirStatus(proposta.status)}
                  </span>

                  <Link
                    to={`/admin/propostas/${proposta.id}`}
                    className="admin-propostas-analisar"
                  >
                    {proposta.status === "PENDENTE"
                      ? "Analisar"
                      : "Visualizar"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminPropostas;