import { Link } from "react-router-dom";
import "./Gestor.css";

function Gestor() {
  const solicitacoes = [
    {
      protocolo: "RZ-2026-001",
      nome: "João da Silva",
      bairro: "Boa Vista",
      data: "10/09/2026",
      status: "PENDENTE",
    },
    {
      protocolo: "RZ-2026-002",
      nome: "Maria Souza",
      bairro: "Casa Forte",
      data: "09/09/2026",
      status: "EM_ANALISE",
    },
    {
      protocolo: "RZ-2026-003",
      nome: "Carlos Lima",
      bairro: "Madalena",
      data: "08/09/2026",
      status: "APROVADO",
    },
  ];

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
    <main className="gestor-page">
      <div className="gestor-container">

        <section className="gestor-topo">
          <div>
            <span className="gestor-label">
              Área administrativa
            </span>

            <h1>Painel do Gestor</h1>

            <p>
              Acompanhe e analise as solicitações de plantio enviadas pelos
              cidadãos.
            </p>
          </div>

          <div className="gestor-perfil">
            <div className="gestor-avatar">
              👤
            </div>

            <div>
              <strong>Samuel</strong>
              <span>Gestor</span>
            </div>
          </div>
        </section>

        <section className="gestor-resumo">

          <div className="gestor-resumo-card">
            <span>Total de solicitações</span>
            <strong>12</strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Pendentes</span>
            <strong>5</strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Em análise</span>
            <strong>3</strong>
          </div>

          <div className="gestor-resumo-card">
            <span>Aprovadas</span>
            <strong>4</strong>
          </div>

        </section>

        <section className="gestor-lista-card">

          <div className="gestor-lista-header">
            <div>
              <h2>Solicitações recentes</h2>

              <p>
                Clique em uma solicitação para visualizar todos os detalhes.
              </p>
            </div>
          </div>

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
                {solicitacoes.map((solicitacao) => (
                  <tr key={solicitacao.protocolo}>

                    <td>
                      <strong className="gestor-protocolo">
                        {solicitacao.protocolo}
                      </strong>
                    </td>

                    <td>
                      {solicitacao.nome}
                    </td>

                    <td>
                      {solicitacao.bairro}
                    </td>

                    <td>
                      {solicitacao.data}
                    </td>

                    <td>
                      <span
                        className={`gestor-status status-${solicitacao.status.toLowerCase()}`}
                      >
                        {formatarStatus(solicitacao.status)}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/gestor/solicitacao/${solicitacao.protocolo}`}
                        className="gestor-ver"
                      >
                        Ver detalhes
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Gestor;