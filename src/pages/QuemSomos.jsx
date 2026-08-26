import { Link } from "react-router-dom";
import "./QuemSomos.css";

function QuemSomos() {
  return (
    <main className="quem-somos-page">

      {/* =========================================
          TÍTULO DA PÁGINA
      ========================================== */}

      <div className="quem-somos-title">

        <div className="titulo-com-logo">

          {/* Logo laranja */}
          <div className="quem-somos-logo">
            <div className="logo-face">
              <span></span>
              <span></span>
              <div className="logo-mouth"></div>
            </div>
          </div>

          <h1>Quem Somos</h1>

        </div>

      </div>


      {/* =========================================
          CARD PRINCIPAL
      ========================================== */}

      <section className="quem-somos-card">

        {/* =========================================
            NOSSA MISSÃO
        ========================================== */}

        <section className="missao-section">

          <h2>Nossa Missão</h2>

          <p>
            Esta página será atualizada em breve com informações completas
            sobre nosso projeto e missão. Estamos trabalhando para trazer
            mais detalhes sobre nossa iniciativa de tornar Recife uma cidade
            mais verde e sustentável.
          </p>

        </section>


        {/* =========================================
            POR QUE A CAPIVARA?
        ========================================== */}

        <section className="capivara-section">

          <h2>Por que a Capivara?</h2>

          <div className="capivara-content">

            {/* Logo verde */}
            <div className="capivara-ilustracao">

              <div className="capivara-circulo">

                <div className="capivara-logo">

                  <div className="logo-face">
                    <span></span>
                    <span></span>
                    <div className="logo-mouth"></div>
                  </div>

                </div>

              </div>

            </div>


            {/* Texto */}
            <div className="capivara-texto">

              <p>
                A capivara é um símbolo importante da fauna de Recife,
                especialmente nas áreas próximas aos rios como o Capibaribe,
                de onde vem o nome do nosso programa <strong>“Capiba Verde”</strong>.
              </p>

              <p>
                Este animal representa a harmonia entre natureza e cidade,
                coexistindo nos espaços urbanos. Assim como queremos que nossas
                árvores façam parte da paisagem urbana, as capivaras nos lembram
                que é possível integrar elementos naturais ao ambiente da cidade.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            CTA
        ========================================== */}

        <section className="cta-section">

          <div className="cta-content">

            <h2>Contribua com o Raiz Urbana</h2>

            <p>
              Você pode ajudar a transformar Recife em uma cidade mais verde
              solicitando o plantio de árvores, compartilhando nosso projeto
              e participando do programa de recompensas Capiba Verde.
            </p>

          </div>

          <Link
            to="/solicitar-plantio"
            className="cta-button"
          >
            Solicitar Plantio
          </Link>

        </section>

      </section>

    </main>
  );
}

export default QuemSomos;