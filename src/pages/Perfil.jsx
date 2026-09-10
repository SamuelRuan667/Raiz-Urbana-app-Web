import { Link } from "react-router-dom";
import "./Perfil.css";

function Perfil() {
  return (
    <main className="perfil-page">
      <div className="perfil-container">

        <section className="perfil-card perfil-principal">
          <div className="perfil-avatar">
            👤
          </div>

          <div className="perfil-info">
            <span className="perfil-label">Meu perfil</span>
            <h1>Samuel</h1>
            <p>
              Acompanhe seus dados e suas solicitações de plantio.
            </p>
          </div>

          <Link to="/perfil/editar" className="perfil-editar">
            Editar perfil
          </Link>
        </section>

        <section className="perfil-dados-card">
          <div className="perfil-section-header">
            <h2>Dados pessoais</h2>
          </div>

          <div className="perfil-dados-grid">

            <div className="perfil-dado">
              <span>Nome completo</span>
              <strong>Samuel</strong>
            </div>

            <div className="perfil-dado">
              <span>CPF</span>
              <strong>000.000.000-00</strong>
            </div>

            <div className="perfil-dado">
              <span>E-mail</span>
              <strong>samuel@email.com</strong>
            </div>

            <div className="perfil-dado">
              <span>Telefone</span>
              <strong>(81) 99999-9999</strong>
            </div>

            <div className="perfil-dado perfil-dado-largo">
              <span>Endereço</span>
              <strong>Recife - PE</strong>
            </div>

          </div>
        </section>

        <section className="perfil-resumo">

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌱</div>

            <div>
              <strong>2</strong>
              <p>Solicitações</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🔎</div>

            <div>
              <strong>1</strong>
              <p>Em análise</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌳</div>

            <div>
              <strong>1</strong>
              <p>Concluídas</p>
            </div>
          </div>

        </section>

        <section className="perfil-solicitacoes">

          <div className="perfil-section-header">
            <h2>Minhas solicitações</h2>
          </div>

          <div className="perfil-solicitacao-item">

            <div>
              <span className="solicitacao-protocolo">
                RZ-2026-001
              </span>

              <h3>Solicitação de plantio</h3>

              <p>
                Recife - PE
              </p>
            </div>

            <span className="status status-pendente">
              Em análise
            </span>

          </div>

          <div className="perfil-solicitacao-item">

            <div>
              <span className="solicitacao-protocolo">
                RZ-2026-002
              </span>

              <h3>Solicitação de plantio</h3>

              <p>
                Recife - PE
              </p>
            </div>

            <span className="status status-concluido">
              Concluído
            </span>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Perfil;