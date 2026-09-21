import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Mais árvores, mais vida</h1>

            <h2>
              Um Recife mais verde começa com você
            </h2>

            <p>
              Solicite o plantio de árvores na sua calçada e ajude a
              construir uma cidade mais fresca, saudável e bonita.
            </p>

            <div className="hero-buttons">
              <Link
                to="/solicitar-plantio"
                className="btn-primary"
              >
                Solicitar Plantio →
              </Link>

              <Link
                to="/consultar-status"
                className="btn-secondary"
              >
                Acompanhar Solicitação
              </Link>
            </div>
          </div>

          <div className="hero-illustration">
            <div className="illustration-badge">
              Mais vida para a cidade
            </div>

            <div className="green-circle">
              <div className="face">
                <div className="eyes">
                  <span></span>
                  <span></span>
                </div>

                <div className="mouth"></div>
              </div>

              <div className="illustration-leaf leaf-one">
                🍃
              </div>

              <div className="illustration-leaf leaf-two">
                🌿
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="learn-section">
        <div className="section-title">
          <h2>
            Saiba Mais Sobre Arborização
          </h2>

          <p>
            Antes de solicitar o plantio, conheça alguns cuidados
            importantes e os benefícios que as árvores trazem para
            nossa cidade.
          </p>
        </div>

        <div className="learn-cards">
          <div className="info-card danger-card">
            <div className="card-title">
              <div className="card-icon">
                !
              </div>

              <h3>Onde NÃO Plantar</h3>
            </div>

            <ul>
              <li>
                Sob redes elétricas de alta tensão
              </li>

              <li>
                Em frente a garagens ou entradas de veículos
              </li>

              <li>
                Em calçadas com menos de 1,2m de largura
              </li>

              <li>
                Próximo a esquinas (distância mínima de 5m)
              </li>

              <li>
                Em cima de tubulações de água ou esgoto
              </li>

              <li>
                Em frente a pontos de ônibus
              </li>
            </ul>
          </div>

          <div className="info-card benefits-card">
            <div className="card-title">
              <div className="card-icon">
                ✓
              </div>

              <h3>Benefícios das Árvores</h3>
            </div>

            <ul>
              <li>
                Redução da temperatura em até 8°C
              </li>

              <li>
                Melhoria da qualidade do ar
              </li>

              <li>
                Redução de enchentes e alagamentos
              </li>

              <li>
                Aumento da biodiversidade urbana
              </li>

              <li>
                Valorização dos imóveis
              </li>

              <li>
                Melhoria da saúde física e mental dos moradores
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-title">
          <h2>Como Funciona</h2>

          <p>
            Em poucos passos você pode contribuir para deixar
            Recife mais verde.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">
              1
            </div>

            <h3>Solicite</h3>

            <p>
              Preencha o formulário de solicitação com seus dados
              e o endereço onde deseja o plantio.
            </p>
          </div>

          <div className="step">
            <div className="step-number">
              2
            </div>

            <h3>Aguarde</h3>

            <p>
              Nossa equipe técnica fará uma avaliação do local
              para verificar a viabilidade do plantio.
            </p>
          </div>

          <div className="step">
            <div className="step-number">
              3
            </div>

            <h3>Celebre</h3>

            <p>
              Após o plantio, cuide da sua árvore e compartilhe
              fotos com a gente. Sua cidade agradece!
            </p>
          </div>
        </div>

        <div className="center-button">
          <Link
            to="/solicitar-plantio"
            className="btn-primary"
          >
            ● Solicitar Agora →
          </Link>
        </div>
      </section>

      <section className="capiba-section">
        <div className="capiba-content">
          <div className="section-title">
            <h2>
              Sistema Capiba Verde
            </h2>

            <p>
              Participe do nosso programa de recompensas e ganhe
              moedas Capiba toda vez que contribuir para deixar
              Recife mais verde!
            </p>
          </div>

          <div className="capiba-cards">
            <div className="capiba-card">
              <div className="capiba-icon">
                ★
              </div>

              <h3>
                Moedas Capiba
              </h3>

              <p>
                Ganhe moedas Capiba para cada ação sustentável
                realizada. Use-as para resgatar recompensas!
              </p>
            </div>

            <div className="capiba-card">
              <div className="capiba-icon">
                🏆
              </div>

              <h3>
                Desafios Ambientais
              </h3>

              <p>
                Complete desafios especiais e ganhe bônus de
                moedas Capiba. Fique atento às missões semanais!
              </p>
            </div>

            <div className="capiba-card">
              <div className="capiba-icon">
                %
              </div>

              <h3>
                Cupons de Desconto
              </h3>

              <p>
                Troque suas moedas por cupons de desconto da
                Uber, 99Pop e outros parceiros que apoiam nossa causa!
              </p>
            </div>
          </div>

          <div className="center-button">
            <Link
              to="/recompensas"
              className="btn-secondary"
            >
              🏆 Conhecer as Recompensas →
            </Link>
          </div>
        </div>
      </section>

      <section className="parceiros-home-section">
        <div className="parceiros-home-content">
          <div className="parceiros-home-icon">
            🤝
          </div>

          <div className="parceiros-home-text">
            <span className="parceiros-home-label">
              Empresas Parceiras
            </span>

            <h2>
              Sua empresa também pode ajudar a transformar Recife
            </h2>

            <p>
              Faça parte do Raiz Urbana e contribua com ações que
              promovem arborização, sustentabilidade e melhoria dos
              espaços urbanos.
            </p>

            <p>
              Conheça o programa de parcerias, seus benefícios e
              envie uma proposta para nossa equipe.
            </p>

            <Link
              to="/parcerias"
              className="btn-primary"
            >
              Conhecer o programa →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;