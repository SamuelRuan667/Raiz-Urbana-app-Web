import { Link } from "react-router-dom";
import "./ConfirmacaoProposta.css";

function ConfirmacaoProposta() {
  return (
    <main className="confirmacao-proposta-page">
      <div className="confirmacao-proposta-card">
        <div className="confirmacao-proposta-icon">
          ✓
        </div>

        <span className="confirmacao-proposta-label">
          Proposta enviada
        </span>

        <h1>Recebemos sua proposta!</h1>

        <p className="confirmacao-proposta-description">
          Obrigado pelo interesse em fazer parte do Raiz Urbana.
          Sua proposta de parceria foi recebida e será analisada
          pela nossa equipe.
        </p>

        <div className="confirmacao-proposta-status">
          <div className="confirmacao-status-icon">
            🔎
          </div>

          <div>
            <span>Status da proposta</span>
            <strong>Aguardando análise</strong>
          </div>
        </div>

        <div className="confirmacao-proposta-etapas">
          <h2>O que acontece agora?</h2>

          <div className="confirmacao-etapa">
            <div className="confirmacao-etapa-numero">
              1
            </div>

            <div>
              <h3>Proposta recebida</h3>

              <p>
                As informações da sua empresa foram enviadas
                para análise.
              </p>
            </div>
          </div>

          <div className="confirmacao-etapa">
            <div className="confirmacao-etapa-numero">
              2
            </div>

            <div>
              <h3>Análise da proposta</h3>

              <p>
                A administração do Raiz Urbana avaliará os dados
                e a proposta de parceria.
              </p>
            </div>
          </div>

          <div className="confirmacao-etapa">
            <div className="confirmacao-etapa-numero">
              3
            </div>

            <div>
              <h3>Resultado</h3>

              <p>
                Após a análise, a empresa receberá o resultado
                da proposta e as próximas orientações.
              </p>
            </div>
          </div>

          <div className="confirmacao-etapa">
            <div className="confirmacao-etapa-numero">
              4
            </div>

            <div>
              <h3>Início da parceria</h3>

              <p>
                Se aprovada, a empresa poderá fazer parte do
                programa de parceiros do Raiz Urbana.
              </p>
            </div>
          </div>
        </div>

        <div className="confirmacao-proposta-aviso">
          <span>💡</span>

          <p>
            Não é necessário enviar a proposta novamente.
            Aguarde a conclusão da análise.
          </p>
        </div>

        <div className="confirmacao-proposta-acoes">
          <Link
            to="/"
            className="confirmacao-btn-principal"
          >
            Voltar para o início
          </Link>

          <Link
            to="/parcerias"
            className="confirmacao-btn-secundario"
          >
            Ver programa de parcerias
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ConfirmacaoProposta;