import { Link, useParams } from "react-router-dom";
import "./AdminSolicitacaoDetalhes.css";

function AdminSolicitacaoDetalhes() {
  const { id } = useParams();

  const solicitacao = {
    id,
    protocolo: "2026000001",
    status: "PENDENTE",
    dataSolicitacao: "24/09/2026",

    nomeCompleto: "Usuário Exemplo",
    cpf: "000.000.000-00",
    telefone: "(81) 99999-9999",
    email: "usuario@exemplo.com",

    cep: "50030-230",
    bairro: "Recife Antigo",
    ruaAvenida: "Rua do Exemplo",
    numero: "100",
    pontoReferencia: "Próximo à praça",

    tipoLocal: "Calçada",
    observacoes:
      "Local com bastante incidência de sol durante o dia.",

    fotoUrl: null,
  };

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
        return "admin-detalhe-status-pendente";

      case "EM_ANALISE":
      case "VISITA_AGENDADA":
        return "admin-detalhe-status-analise";

      case "APROVADO":
      case "CONCLUIDO":
        return "admin-detalhe-status-concluido";

      case "RECUSADO":
        return "admin-detalhe-status-recusado";

      default:
        return "";
    }
  };

  return (
    <main className="admin-solicitacao-detalhes-page">
      <div className="admin-solicitacao-detalhes-container">
        <div className="admin-solicitacao-detalhes-voltar">
          <Link to="/admin/solicitacoes">
            ← Voltar para solicitações
          </Link>
        </div>

        <section className="admin-solicitacao-detalhes-topo">
          <div>
            <span className="admin-solicitacao-detalhes-label">
              Solicitação de plantio
            </span>

            <h1>
              Protocolo {solicitacao.protocolo}
            </h1>

            <p>
              Visualize todas as informações da solicitação.
            </p>
          </div>

          <span
            className={`admin-detalhe-status ${classeStatus(
              solicitacao.status
            )}`}
          >
            {traduzirStatus(solicitacao.status)}
          </span>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Informações da solicitação</h2>

          <div className="admin-solicitacao-detalhes-grid">
            <div className="admin-solicitacao-detalhe-dado">
              <span>Protocolo</span>
              <strong>{solicitacao.protocolo}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Data da solicitação</span>
              <strong>{solicitacao.dataSolicitacao}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Status</span>
              <strong>
                {traduzirStatus(solicitacao.status)}
              </strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>ID</span>
              <strong>{solicitacao.id}</strong>
            </div>
          </div>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Dados do solicitante</h2>

          <div className="admin-solicitacao-detalhes-grid">
            <div className="admin-solicitacao-detalhe-dado">
              <span>Nome completo</span>
              <strong>{solicitacao.nomeCompleto}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>CPF</span>
              <strong>{solicitacao.cpf}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>E-mail</span>
              <strong>{solicitacao.email}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Telefone</span>
              <strong>{solicitacao.telefone}</strong>
            </div>
          </div>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Endereço do plantio</h2>

          <div className="admin-solicitacao-detalhes-grid">
            <div className="admin-solicitacao-detalhe-dado">
              <span>CEP</span>
              <strong>{solicitacao.cep}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Bairro</span>
              <strong>{solicitacao.bairro}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado admin-solicitacao-detalhe-largo">
              <span>Rua / Avenida</span>
              <strong>{solicitacao.ruaAvenida}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Número</span>
              <strong>
                {solicitacao.numero || "Não informado"}
              </strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado">
              <span>Ponto de referência</span>
              <strong>
                {solicitacao.pontoReferencia ||
                  "Não informado"}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Detalhes do local</h2>

          <div className="admin-solicitacao-detalhes-grid">
            <div className="admin-solicitacao-detalhe-dado">
              <span>Tipo do local</span>
              <strong>{solicitacao.tipoLocal}</strong>
            </div>

            <div className="admin-solicitacao-detalhe-dado admin-solicitacao-detalhe-largo">
              <span>Observações</span>

              <p className="admin-solicitacao-observacoes">
                {solicitacao.observacoes ||
                  "Nenhuma observação informada."}
              </p>
            </div>
          </div>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Foto do local</h2>

          <div className="admin-solicitacao-foto-container">
            {solicitacao.fotoUrl ? (
              <img
                src={solicitacao.fotoUrl}
                alt="Local solicitado para plantio"
                className="admin-solicitacao-foto"
              />
            ) : (
              <div className="admin-solicitacao-sem-foto">
                <div>🌳</div>

                <strong>Foto do local</strong>

                <p>
                  A imagem real será carregada quando esta página
                  estiver integrada ao backend.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="admin-solicitacao-detalhes-card">
          <h2>Responsável pela análise</h2>

          <div className="admin-solicitacao-gestor-info">
            <div className="admin-solicitacao-gestor-icon">
              👤
            </div>

            <div>
              <span>Gestor responsável</span>

              <strong>
                Ainda não atribuído
              </strong>

              <p>
                O gestor responsável será definido de acordo com
                o bairro da solicitação.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminSolicitacaoDetalhes;