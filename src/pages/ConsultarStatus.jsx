import { useState } from "react";
import API_URL from "../services/api";
import "./ConsultarStatus.css";

function ConsultarStatus() {
  const [protocolo, setProtocolo] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const formatarStatus = (status) => {
    const nomes = {
      PENDENTE: "Pendente",
      EM_ANALISE: "Análise Técnica",
      VISITA_AGENDADA: "Visita Agendada",
      APROVADO: "Aprovado",
      RECUSADO: "Recusado",
      CONCLUIDO: "Concluído",
    };

    return nomes[status] || status;
  };

  const descricaoStatus = (status) => {
    const descricoes = {
      PENDENTE:
        "Sua solicitação foi recebida e aguarda análise.",
      EM_ANALISE:
        "Sua solicitação está sendo avaliada pela equipe técnica.",
      VISITA_AGENDADA:
        "Uma visita técnica foi agendada para avaliar o local.",
      APROVADO:
        "Sua solicitação foi aprovada para o plantio.",
      RECUSADO:
        "Sua solicitação não foi aprovada.",
      CONCLUIDO:
        "O processo de plantio foi concluído.",
    };

    return (
      descricoes[status] ||
      "Acompanhe o andamento da sua solicitação."
    );
  };

  const consultarProtocolo = async (e) => {
    e.preventDefault();

    const protocoloLimpo = protocolo.trim();

    if (!protocoloLimpo) {
      setErro("Digite o número do protocolo.");
      setResultado(null);
      return;
    }

    setBuscando(true);
    setResultado(null);
    setErro("");

    try {
      const resposta = await fetch(
        `${API_URL}/api/solicitacoes/protocolo/${encodeURIComponent(
          protocoloLimpo
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (resposta.status === 404) {
        throw new Error(
          "Protocolo não encontrado. Verifique o número informado."
        );
      }

      if (!resposta.ok) {
        let mensagem =
          "Não foi possível consultar o protocolo.";

        try {
          const erroBackend = await resposta.json();

          mensagem =
            erroBackend?.message ||
            erroBackend?.mensagem ||
            mensagem;
        } catch {
          // Mantém a mensagem padrão.
        }

        throw new Error(mensagem);
      }

      const dados = await resposta.json();

      setResultado(dados);
    } catch (error) {
      console.error(
        "Erro ao consultar protocolo:",
        error
      );

      setResultado(null);

      setErro(
        error.message ||
          "Não foi possível consultar o protocolo."
      );
    } finally {
      setBuscando(false);
    }
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
                placeholder="Ex: 000013"
                value={protocolo}
                inputMode="numeric"
                maxLength={10}
                onChange={(e) => {
                  const somenteNumeros =
                    e.target.value.replace(/\D/g, "");

                  setProtocolo(somenteNumeros);
                  setErro("");
                }}
              />

              <button
                type="submit"
                aria-label="Consultar protocolo"
                disabled={buscando}
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

          {erro && !buscando && (
            <p className="mensagem-busca">
              {erro}
            </p>
          )}

          {resultado && !buscando && (
            <div className="resultado-card">
              <div className="resultado-topo">
                <div>
                  <span>Protocolo</span>

                  <strong>
                    #{resultado.protocolo}
                  </strong>
                </div>

                <span className="status-atual">
                  {formatarStatus(resultado.status)}
                </span>
              </div>

              <div className="linha-status">
                <div className="status-ponto ativo"></div>

                <div>
                  <strong>
                    {formatarStatus(resultado.status)}
                  </strong>

                  <p>
                    {descricaoStatus(resultado.status)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Card de prazos */}
          <div className="prazos-card">
            <h2>
              Prazos estimados para cada etapa
            </h2>

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
                  <span>
                    (15-30 dias após aprovação)
                  </span>
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