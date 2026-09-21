import { Link } from "react-router-dom";
import "./Parcerias.css";

function Parcerias() {
  return (
    <main className="parcerias-page">
      <section className="parcerias-hero">
        <div className="parcerias-hero-content">
          <span className="parcerias-label">
            Empresas Parceiras
          </span>

          <h1>
            Sua empresa pode ajudar a construir um Recife mais verde
          </h1>

          <p>
            Faça parte do programa de parcerias do Raiz Urbana e
            contribua para ações de arborização, sustentabilidade e
            melhoria dos espaços urbanos.
          </p>

          <Link
            to="/parcerias/proposta"
            className="parcerias-btn-primary"
          >
            Quero ser parceiro →
          </Link>
        </div>

        <div className="parcerias-hero-icon">
          🤝
        </div>
      </section>

      <section className="parcerias-beneficios">
        <div className="parcerias-section-title">
          <span>Por que participar?</span>

          <h2>
            Benefícios de ser uma empresa parceira
          </h2>

          <p>
            Empresas parceiras ajudam a transformar a cidade e
            fortalecem seu compromisso com ações ambientais e sociais.
          </p>
        </div>

        <div className="parcerias-beneficios-grid">
          <article className="parcerias-card">
            <div className="parcerias-card-icon">
              🌱
            </div>

            <h3>Impacto ambiental</h3>

            <p>
              Apoie ações de arborização urbana que ajudam a reduzir
              o calor, melhorar a qualidade do ar e ampliar as áreas
              verdes da cidade.
            </p>
          </article>

          <article className="parcerias-card">
            <div className="parcerias-card-icon">
              🤝
            </div>

            <h3>Responsabilidade social</h3>

            <p>
              Demonstre o compromisso da empresa com iniciativas que
              promovem qualidade de vida, sustentabilidade e bem-estar
              para a população.
            </p>
          </article>

          <article className="parcerias-card">
            <div className="parcerias-card-icon">
              📢
            </div>

            <h3>Visibilidade</h3>

            <p>
              Empresas parceiras poderão ter sua participação
              reconhecida nas ações e iniciativas realizadas pelo
              projeto Raiz Urbana.
            </p>
          </article>

          <article className="parcerias-card">
            <div className="parcerias-card-icon">
              🌳
            </div>

            <h3>Cidade mais verde</h3>

            <p>
              Contribua diretamente para a criação de espaços urbanos
              mais arborizados, confortáveis e sustentáveis.
            </p>
          </article>
        </div>
      </section>

      <section className="parcerias-como-funciona">
        <div className="parcerias-section-title">
          <span>Processo de parceria</span>

          <h2>Como funciona?</h2>

          <p>
            A proposta passa por algumas etapas antes da empresa se
            tornar oficialmente uma parceira do Raiz Urbana.
          </p>
        </div>

        <div className="parcerias-passos">
          <div className="parcerias-passo">
            <div className="parcerias-numero">
              1
            </div>

            <h3>Conheça o programa</h3>

            <p>
              Veja como sua empresa pode participar e contribuir com
              as ações do Raiz Urbana.
            </p>
          </div>

          <div className="parcerias-passo">
            <div className="parcerias-numero">
              2
            </div>

            <h3>Envie sua proposta</h3>

            <p>
              Preencha o formulário com os dados da empresa e explique
              como deseja participar do projeto.
            </p>
          </div>

          <div className="parcerias-passo">
            <div className="parcerias-numero">
              3
            </div>

            <h3>Análise</h3>

            <p>
              A proposta será analisada pela administração do Raiz
              Urbana antes da aprovação.
            </p>
          </div>

          <div className="parcerias-passo">
            <div className="parcerias-numero">
              4
            </div>

            <h3>Parceria</h3>

            <p>
              Após a aprovação, a empresa passa a integrar o programa
              e poderá acessar sua área de parceiro.
            </p>
          </div>
        </div>
      </section>

      <section className="parcerias-cta">
        <div className="parcerias-cta-content">
          <div>
            <span className="parcerias-label">
              Faça parte
            </span>

            <h2>
              Pronto para transformar Recife com a gente?
            </h2>

            <p>
              Envie uma proposta de parceria. Nossa equipe analisará
              as informações e entrará em contato após a avaliação.
            </p>
          </div>

          <Link
            to="/parcerias/proposta"
            className="parcerias-btn-primary"
          >
            Enviar proposta →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Parcerias;