import { Link } from "react-router-dom";
import "./Recompensas.css";

function Recompensas() {
  const recompensas = [
    {
      titulo: "Cupom 15% de desconto na Uber",
      validade: "Válido por 30 dias após o resgate",
      custo: "100 moedas",
      disponivel: true,
    },
    {
      titulo: "Cupom 10% de desconto na 99Pop",
      validade: "Válido por 30 dias após o resgate",
      custo: "80 moedas",
      disponivel: true,
    },
    {
      titulo: "Vale Planta - Desconto em Jardinagem",
      validade: "Válido por 30 dias após o resgate",
      custo: "150 moedas",
      disponivel: false,
    },
    {
      titulo: "Kit Sementes Nativas",
      validade: "Válido por 30 dias após o resgate",
      custo: "200 moedas",
      disponivel: false,
    },
  ];

  return (
    <main className="recompensas-page">

      {/* =========================================
          CABEÇALHO
      ========================================== */}

      <section className="recompensas-header">

        <div className="trofeu-icon">
          🏆
        </div>

        <div>
          <h1>Sistema de Recompensas Capiba Verde</h1>

          <p>
            Participe do nosso programa de gamificação e ganhe moedas Capiba
            ao solicitar o plantio de árvores. Troque suas moedas por cupons
            de desconto e contribua para um Recife mais verde e sustentável.
          </p>
        </div>

      </section>


      {/* =========================================
          CARD PRINCIPAL
      ========================================== */}

      <section className="recompensas-card">

        <h2>Programa Capiba Verde</h2>


        {/* =========================================
            SISTEMA DE RECOMPENSAS
        ========================================== */}

        <div className="sistema-recompensas">

          <div className="sistema-header">

            <div className="sistema-titulo">
              <span className="folha-icon">🌿</span>

              <h3>Sistema de Recompensas</h3>
            </div>

            <div className="saldo-badge">
              <span>★</span> 120 Moedas Capiba
            </div>

          </div>

          <p>
            Troque suas moedas Capiba por recompensas exclusivas! Quanto mais
            você contribui com o verde da cidade, mais benefícios você recebe.
          </p>

        </div>


        {/* =========================================
            RECOMPENSAS DISPONÍVEIS
        ========================================== */}

        <div className="recompensas-disponiveis">

          <h3>Recompensas Disponíveis</h3>

          <div className="recompensas-grid">

            {recompensas.map((recompensa, index) => (
              <div className="recompensa-item" key={index}>

                <div className="recompensa-icon">
                  %
                </div>

                <h4>{recompensa.titulo}</h4>

                <p className="validade">
                  {recompensa.validade}
                </p>

                <div className="recompensa-footer">

                  <span className="custo">
                    <span>★</span> {recompensa.custo}
                  </span>

                  <button
                    type="button"
                    disabled={!recompensa.disponivel}
                    className={
                      recompensa.disponivel
                        ? "resgatar-button"
                        : "resgatar-button disabled"
                    }
                  >
                    Resgatar
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>


        {/* =========================================
            COMO GANHAR MAIS MOEDAS
        ========================================== */}

        <section className="ganhar-moedas">

          <h3>Como ganhar mais moedas Capiba?</h3>

          <div className="ganhar-lista">

            <div className="ganhar-item">
              <span className="ganhar-icon">🌱</span>

              <div>
                <strong>Solicite o plantio de árvores</strong>

                <p>
                  20 moedas por solicitação aprovada
                </p>
              </div>
            </div>


            <div className="ganhar-item">
              <span className="ganhar-icon">📷</span>

              <div>
                <strong>
                  Compartilhe fotos da sua árvore após o plantio
                </strong>

                <p>
                  10 moedas
                </p>
              </div>
            </div>


            <div className="ganhar-item">
              <span className="ganhar-icon">🤝</span>

              <div>
                <strong>
                  Convide amigos para o programa
                </strong>

                <p>
                  15 moedas por amigo
                </p>
              </div>
            </div>


            <div className="ganhar-item">
              <span className="ganhar-icon">🌳</span>

              <div>
                <strong>
                  Participe de eventos de plantio coletivo
                </strong>

                <p>
                  50 moedas
                </p>
              </div>
            </div>

          </div>

        </section>


        {/* =========================================
            CTA
        ========================================== */}

        <div className="recompensas-cta">

          <p>
            Quer começar a acumular moedas Capiba?
          </p>

          <Link
            to="/solicitar-plantio"
            className="recompensas-cta-button"
          >
            Solicitar Plantio
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Recompensas;