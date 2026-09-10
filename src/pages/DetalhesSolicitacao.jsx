import { Link, useParams } from "react-router-dom";
import "./DetalhesSolicitacao.css";

function DetalhesSolicitacao() {
  const { protocolo } = useParams();

  const solicitacao = {
    protocolo: protocolo || "RZ-2026-001",
    nomeCompleto: "João da Silva",
    cpf: "000.000.000-00",
    email: "joao@email.com",
    telefone: "(81) 99999-9999",

    cep: "50000-000",
    ruaAvenida: "Rua do Sol",
    numero: "120",
    bairro: "Boa Vista",
    pontoReferencia: "Próximo à praça",

    tipoLocal: "Calçada",
    observacoes:
      "Local com pouca sombra e espaço disponível para plantio.",

    dataSolicitacao: "10/09/2026",
    status: "PENDENTE",
  };

  const handleAprovar = () => {
    alert("Solicitação aprovada!");
  };

  const handleRecusar = () => {
    alert("Solicitação recusada!");
  };

  const handleAnalise = () => {
    alert("Solicitação colocada em análise!");
  };

  const formatarStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";

      case "EM_ANALISE":
        return "Em análise";

      case "APROVADO":
        return "Aprovado";

      case "RECUSADO":
        return "Recusado";

      case "CONCLUIDO":
        return "Concluído";

      default:
        return status;
    }
  };

  return (
    <main className="detalhes-page">
      <div className="detalhes-container">

        <Link to="/gestor" className="detalhes-voltar">
          ← Voltar para o painel
        </Link>

        <section className="detalhes-topo">
          <div>
            <span className="detalhes-label">
              Solicitação de plantio
            </span>

            <h1>{solicitacao.protocolo}</h1>

            <p>
              Enviada em {solicitacao.dataSolicitacao}
            </p>
          </div>

          <span
            className={`detalhes-status status-${solicitacao.status.toLowerCase()}`}
          >
            {formatarStatus(solicitacao.status)}
          </span>
        </section>

        <section className="detalhes-grid">

          <div className="detalhes-card">

            <h2>Dados do solicitante</h2>

            <div className="detalhes-informacoes">

              <div className="detalhes-item">
                <span>Nome completo</span>
                <strong>
                  {solicitacao.nomeCompleto}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>CPF</span>
                <strong>
                  {solicitacao.cpf}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>E-mail</span>
                <strong>
                  {solicitacao.email}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Telefone</span>
                <strong>
                  {solicitacao.telefone}
                </strong>
              </div>

            </div>

          </div>

          <div className="detalhes-card">

            <h2>Endereço do plantio</h2>

            <div className="detalhes-informacoes">

              <div className="detalhes-item">
                <span>CEP</span>
                <strong>
                  {solicitacao.cep}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Bairro</span>
                <strong>
                  {solicitacao.bairro}
                </strong>
              </div>

              <div className="detalhes-item detalhes-item-largo">
                <span>Rua / Avenida</span>
                <strong>
                  {solicitacao.ruaAvenida}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>Número</span>
                <strong>
                  {solicitacao.numero || "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item detalhes-item-largo">
                <span>Ponto de referência</span>
                <strong>
                  {solicitacao.pontoReferencia}
                </strong>
              </div>

            </div>

          </div>

        </section>

        <section className="detalhes-card detalhes-plantio">

          <h2>Informações do plantio</h2>

          <div className="detalhes-informacoes">

            <div className="detalhes-item">
              <span>Tipo do local</span>
              <strong>
                {solicitacao.tipoLocal}
              </strong>
            </div>

            <div className="detalhes-item detalhes-item-largo">
              <span>Observações</span>

              <p>
                {solicitacao.observacoes ||
                  "Nenhuma observação informada."}
              </p>
            </div>

          </div>

        </section>

        <section className="detalhes-card">

          <h2>Foto do local</h2>

          <div className="detalhes-foto">

            <div className="detalhes-foto-placeholder">
              <span>🌳</span>
              <p>Foto enviada pelo solicitante</p>
            </div>

          </div>

        </section>

        <section className="detalhes-card detalhes-decisao">

          <div>
            <h2>Análise da solicitação</h2>

            <p>
              Atualize o status após analisar as informações
              e a foto do local.
            </p>
          </div>

          <div className="detalhes-acoes">

            <button
              type="button"
              className="detalhes-btn detalhes-analise"
              onClick={handleAnalise}
            >
              Colocar em análise
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-recusar"
              onClick={handleRecusar}
            >
              Recusar
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-aprovar"
              onClick={handleAprovar}
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