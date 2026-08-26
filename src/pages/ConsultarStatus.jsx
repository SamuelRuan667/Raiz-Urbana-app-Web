import { useState } from "react";
import "./ConsultarStatus.css";

function ConsultarStatus() {
  const [protocolo, setProtocolo] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const consultarProtocolo = (e) => {
    e.preventDefault();

    if (!protocolo.trim()) {
      return;
    }

    setBuscando(true);

    // Simulação da consulta.
    // Futuramente será substituída pela integração com o backend.
    setTimeout(() => {
      setResultado({
        protocolo: protocolo,
        status: "Análise Técnica",
      });

      setBuscando(false);
    }, 700);
  };

  return (
    <main className="status-page">
      <section className="status-container">

        {/* Cabeçalho */}
        <div className="status-header">
          <h1>Consultar Status da Solicitação</h1>

          <p>
            Acompanhe o andamento da sua solicitação de plantio
            utilizando o número do protocolo.
          </p>
        </div>

        {/* Área de consulta */}
        <div className="consulta-card">

          <form onSubmit={consultarProtocolo}>
            <label htmlFor="protocolo">
              Número do Protocolo
            </label>

            <div className="campo-busca">
              <input
                type="text"
                id="protocolo"
                placeholder="Ex: 123456"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
              />

              <button
                type="submit"
                aria-label="Consultar protocolo"
              >
                🔍
              </button>
            </div>
          </form>

          {buscando && (
            <p className="mensagem-busca">
              Consultando protocolo...
            </p>
          )}

          {resultado && !buscando && (
            <div className="resultado-card">
              <div className="resultado-topo">
                <div>
                  <span>Protocolo</span>
                  <strong>#{resultado.protocolo}</strong>
                </div>

                <span className="status-atual">
                  {resultado.status}
                </span>
              </div>

              <div className="linha-status">
                <div className="status-ponto ativo"></div>

                <div>
                  <strong>{resultado.status}</strong>
                  <p>
                    Sua solicitação está sendo avaliada pela equipe técnica.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Card de prazos */}
        <div className="prazos-card">

          <h2>Prazos estimados para cada etapa</h2>

          <div className="prazo-item">
            <div className="indicador recebido"></div>

            <div className="prazo-conteudo">
              <h3>Recebido</h3>
              <p>
                Sua solicitação foi registrada no sistema
                <span>(imediato)</span>
              </p>
            </div>
          </div>

          <div className="prazo-item">
            <div className="indicador analise"></div>

            <div className="prazo-conteudo">
              <h3>Análise Técnica</h3>
              <p>
                Avaliação da viabilidade
                <span>(até 15 dias)</span>
              </p>
            </div>
          </div>

          <div className="prazo-item">
            <div className="indicador agendado"></div>

            <div className="prazo-conteudo">
              <h3>Agendado</h3>
              <p>
                Plantio programado
                <span>(15-30 dias após aprovação)</span>
              </p>
            </div>
          </div>

          <div className="prazo-item">
            <div className="indicador concluido"></div>

            <div className="prazo-conteudo">
              <h3>Concluído</h3>
              <p>
                Árvore plantada
                <span>(processo finalizado)</span>
              </p>
            </div>
          </div>

        </div>
        </div>
      </section>
    </main>
  );
}

export default ConsultarStatus;