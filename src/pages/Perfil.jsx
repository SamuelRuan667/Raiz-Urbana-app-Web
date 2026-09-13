import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";

function Perfil() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ============================================================
  // BUSCA AS SOLICITAÇÕES REAIS NO BACK-END (SPRING / SUPABASE)
  // ============================================================
  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setCarregando(true);
        const resposta = await fetch("https://raiz-urbana-back-end.onrender.com");

        if (!resposta.ok) {
          throw new Error("Erro ao carregar solicitações");
        }

        const dados = await resposta.json();
        setSolicitacoes(dados);
      } catch (erro) {
        console.error("Erro ao buscar dados do perfil:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarSolicitacoes();
  }, []);

  // ============================================================
  // CÁLCULO DOS CONTADORES VIVOS
  // ============================================================
  const totalSolicitacoes = solicitacoes.length;

  const totalEmAnalise = solicitacoes.filter(
    (s) =>
      s.status === "PENDENTE" ||
      s.status === "EM_ANALISE" ||
      s.status === "VISITA_AGENDADA"
  ).length;

  const totalConcluidas = solicitacoes.filter(
    (s) => s.status === "CONCLUIDO" || s.status === "APROVADO"
  ).length;

  // ============================================================
  // MAPEAMENTO VISUAL DE STATUS
  // ============================================================
  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return { texto: "Pendente", classe: "status-pendente" };
      case "EM_ANALISE":
        return { texto: "Em análise", classe: "status-pendente" };
      case "VISITA_AGENDADA":
        return { texto: "Visita agendada", classe: "status-pendente" };
      case "APROVADO":
        return { texto: "Aprovado", classe: "status-concluido" };
      case "CONCLUIDO":
        return { texto: "Concluído", classe: "status-concluido" };
      case "RECUSADO":
        return { texto: "Recusado", classe: "status-pendente" };
      default:
        return { texto: status || "Pendente", classe: "status-pendente" };
    }
  };

  return (
    <main className="perfil-page">
      <div className="perfil-container">

        {/* =========================
            CARD DO PERFIL 
        ========================= */}
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

        {/* =========================
            DADOS PESSOAIS 
        ========================= */}
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

        {/* =========================
            RESUMO / CONTADORES DINÂMICOS
        ========================= */}
        <section className="perfil-resumo">
          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌱</div>

            <div>
              <strong>{carregando ? "..." : totalSolicitacoes}</strong>
              <p>Solicitações</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🔎</div>

            <div>
              <strong>{carregando ? "..." : totalEmAnalise}</strong>
              <p>Em análise</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌳</div>

            <div>
              <strong>{carregando ? "..." : totalConcluidas}</strong>
              <p>Concluídas</p>
            </div>
          </div>
        </section>

        {/* =========================
            HISTÓRICO REAL DE SOLICITAÇÕES
        ========================= */}
        <section className="perfil-solicitacoes">
          <div className="perfil-section-header">
            <h2>Minhas solicitações</h2>
          </div>

          {carregando && (
            <p style={{ color: "#687168", padding: "10px 0" }}>
              Carregando solicitações...
            </p>
          )}

          {!carregando && solicitacoes.length === 0 && (
            <p style={{ color: "#687168", padding: "15px 0" }}>
              Nenhuma solicitação enviada ainda.
            </p>
          )}

          {!carregando &&
            solicitacoes.map((item) => {
              const statusInfo = traduzirStatus(item.status);

              return (
                <div key={item.id || item.protocolo} className="perfil-solicitacao-item">
                  <div>
                    <span className="solicitacao-protocolo">
                      {item.protocolo}
                    </span>

                    <h3>Plantio em {item.ruaAvenida || "Solicitação de plantio"}</h3>

                    <p>
                      {item.bairro ? `${item.bairro} - Recife, PE` : "Recife - PE"}
                    </p>
                  </div>

                  <span className={`status ${statusInfo.classe}`}>
                    {statusInfo.texto}
                  </span>
                </div>
              );
            })}
        </section>

      </div>
    </main>
  );
}

export default Perfil;