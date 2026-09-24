import { Link, useParams } from "react-router-dom";
import "./AdminUsuarioDetalhes.css";

function AdminUsuarioDetalhes() {
  const { id } = useParams();

  const usuario = {
    id,
    nomeCompleto: "Usuário Exemplo",
    cpf: "000.000.000-00",
    telefone: "(81) 99999-9999",
    email: "usuario@exemplo.com",
    cep: "51020-000",
    numero: "100",
    rua: "Avenida Exemplo",
    bairro: "Boa Viagem",
    cidade: "Recife",
    estado: "PE",
    tipo: "USUARIO",
    createdAt: "20/09/2026",
  };

  const solicitacoes = [
    {
      id: 1,
      protocolo: "2026000001",
      ruaAvenida: "Avenida Exemplo",
      bairro: "Boa Viagem",
      dataSolicitacao: "24/09/2026",
      status: "PENDENTE",
    },
    {
      id: 4,
      protocolo: "2026000004",
      ruaAvenida: "Rua das Flores",
      bairro: "Boa Viagem",
      dataSolicitacao: "21/09/2026",
      status: "CONCLUIDO",
    },
  ];

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
        return "admin-usuario-status-pendente";

      case "EM_ANALISE":
      case "VISITA_AGENDADA":
        return "admin-usuario-status-analise";

      case "APROVADO":
      case "CONCLUIDO":
        return "admin-usuario-status-concluido";

      case "RECUSADO":
        return "admin-usuario-status-recusado";

      default:
        return "";
    }
  };

  const totalEmAnalise = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "PENDENTE" ||
      solicitacao.status === "EM_ANALISE" ||
      solicitacao.status === "VISITA_AGENDADA"
  ).length;

  const totalConcluidas = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "APROVADO" ||
      solicitacao.status === "CONCLUIDO"
  ).length;

  return (
    <main className="admin-usuario-detalhes-page">
      <div className="admin-usuario-detalhes-container">
        <div className="admin-usuario-detalhes-voltar">
          <Link to="/admin/usuarios">
            ← Voltar para usuários
          </Link>
        </div>

        <section className="admin-usuario-detalhes-topo">
          <div className="admin-usuario-detalhes-avatar">
            👤
          </div>

          <div>
            <span className="admin-usuario-detalhes-label">
              Usuário #{usuario.id}
            </span>

            <h1>{usuario.nomeCompleto}</h1>

            <p>
              Visualize os dados da conta e o histórico de
              solicitações deste usuário.
            </p>
          </div>
        </section>

        <section className="admin-usuario-detalhes-resumo">
          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🌱
            </div>

            <div>
              <strong>{solicitacoes.length}</strong>
              <span>Solicitações</span>
            </div>
          </div>

          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🔎
            </div>

            <div>
              <strong>{totalEmAnalise}</strong>
              <span>Em análise</span>
            </div>
          </div>

          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🌳
            </div>

            <div>
              <strong>{totalConcluidas}</strong>
              <span>Concluídas</span>
            </div>
          </div>
        </section>

        <section className="admin-usuario-detalhes-card">
          <h2>Dados pessoais</h2>

          <div className="admin-usuario-detalhes-grid">
            <div className="admin-usuario-detalhe-dado">
              <span>Nome completo</span>
              <strong>{usuario.nomeCompleto}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>CPF</span>
              <strong>{usuario.cpf}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>E-mail</span>
              <strong>{usuario.email}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Telefone</span>
              <strong>{usuario.telefone}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Tipo da conta</span>
              <strong>Usuário</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Conta criada em</span>
              <strong>{usuario.createdAt}</strong>
            </div>
          </div>
        </section>

        <section className="admin-usuario-detalhes-card">
          <h2>Endereço</h2>

          <div className="admin-usuario-detalhes-grid">
            <div className="admin-usuario-detalhe-dado">
              <span>CEP</span>
              <strong>{usuario.cep}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Número</span>
              <strong>
                {usuario.numero || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado admin-usuario-detalhe-largo">
              <span>Rua / Avenida</span>
              <strong>{usuario.rua}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Bairro</span>
              <strong>{usuario.bairro}</strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Cidade / Estado</span>
              <strong>
                {usuario.cidade} - {usuario.estado}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-usuario-detalhes-card">
          <div className="admin-usuario-solicitacoes-header">
            <div>
              <h2>Solicitações do usuário</h2>

              <p>
                Histórico de solicitações realizadas por esta
                conta.
              </p>
            </div>
          </div>

          <div className="admin-usuario-solicitacoes">
            {solicitacoes.length === 0 && (
              <div className="admin-usuario-sem-solicitacoes">
                Este usuário ainda não realizou nenhuma
                solicitação de plantio.
              </div>
            )}

            {solicitacoes.map((solicitacao) => (
              <article
                key={solicitacao.id}
                className="admin-usuario-solicitacao-item"
              >
                <div className="admin-usuario-solicitacao-principal">
                  <div className="admin-usuario-solicitacao-icon">
                    🌱
                  </div>

                  <div>
                    <span>Protocolo</span>

                    <h3>
                      {solicitacao.protocolo}
                    </h3>

                    <p>
                      {solicitacao.ruaAvenida}
                    </p>
                  </div>
                </div>

                <div className="admin-usuario-solicitacao-dado">
                  <span>Bairro</span>

                  <strong>
                    {solicitacao.bairro}
                  </strong>
                </div>

                <div className="admin-usuario-solicitacao-dado">
                  <span>Data</span>

                  <strong>
                    {solicitacao.dataSolicitacao}
                  </strong>
                </div>

                <div className="admin-usuario-solicitacao-final">
                  <span
                    className={`admin-usuario-solicitacao-status ${classeStatus(
                      solicitacao.status
                    )}`}
                  >
                    {traduzirStatus(
                      solicitacao.status
                    )}
                  </span>

                  <Link
                    to={`/admin/solicitacoes/${solicitacao.id}`}
                    className="admin-usuario-solicitacao-ver"
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

export default AdminUsuarioDetalhes;