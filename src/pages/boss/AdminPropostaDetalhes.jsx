
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminPropostaDetalhes.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function obterToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function formatarData(data) {
  if (!data) return "Não informada";

  const dataValida = new Date(data);

  if (Number.isNaN(dataValida.getTime())) return "Não informada";

  return dataValida.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatarCNPJ(cnpj) {
  const numeros = (cnpj || "").replace(/\D/g, "");

  if (numeros.length !== 14) return cnpj || "Não informado";

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function formatarTelefone(telefone) {
  const numeros = (telefone || "").replace(/\D/g, "");

  if (numeros.length === 11) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (numeros.length === 10) {
    return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return telefone || "Não informado";
}

function formatarCEP(cep) {
  const numeros = (cep || "").replace(/\D/g, "");

  if (numeros.length === 8) {
    return numeros.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  }

  return cep || "Não informado";
}

function extrairProposta(texto = "") {
  const tipo = texto.match(/Tipo de parceria:\s*([^\n]+)/i);
  const descricao = texto.match(/Descrição:\s*([\s\S]*)/i);

  return {
    tipoParceria: tipo?.[1]?.trim() || "Não informado",
    descricao: descricao?.[1]?.trim() || texto || "Nenhuma descrição informada.",
  };
}

function traduzirTipo(tipo) {
  const tipos = {
    BENEFICIOS: "Benefícios e descontos",
    PATROCINIO: "Patrocínio",
    APOIO_AMBIENTAL: "Apoio a ações ambientais",
    DOACAO: "Doação de materiais ou recursos",
    OUTRO: "Outro",
  };

  return tipos[tipo] || tipo || "Não informado";
}

function AdminPropostaDetalhes() {
  const { id } = useParams();

  const [proposta, setProposta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [mostrarRecusa, setMostrarRecusa] = useState(false);

  const carregarProposta = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const token = obterToken();

      if (!token) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }

      const resposta = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/propostas-parceria/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        if (resposta.status === 401) {
          throw new Error("Sua sessão expirou. Faça login novamente.");
        }

        if (resposta.status === 403) {
          throw new Error("Você não tem permissão para acessar esta proposta.");
        }

        throw new Error(
          resultado.erro ||
            resultado.message ||
            "Não foi possível carregar os detalhes da proposta."
        );
      }

      setProposta(resultado);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar a proposta.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarProposta();
  }, [carregarProposta]);

  const executarAnalise = async (acao) => {
    if (!proposta || processando) return;

    if (proposta.status !== "PENDENTE") {
      alert("Esta proposta já foi analisada.");
      return;
    }

    if (acao === "rejeitar" && !motivoRecusa.trim()) {
      alert("Informe o motivo da rejeição.");
      return;
    }

    const mensagem =
      acao === "aprovar"
        ? `Deseja aprovar a proposta da empresa ${proposta.nomeFantasia || proposta.razaoSocial}?`
        : "Deseja realmente rejeitar esta proposta?";

    if (!window.confirm(mensagem)) return;

    try {
      setProcessando(true);
      setErro("");

      const token = obterToken();

      if (!token) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }

      const endpoint =
        acao === "aprovar"
          ? "aprovar"
          : "rejeitar";

      const resposta = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/propostas-parceria/admin/${id}/${endpoint}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          ...(acao === "rejeitar"
            ? {
                body: JSON.stringify({
                  feedback: motivoRecusa.trim(),
                }),
              }
            : {}),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        if (resposta.status === 401) {
          throw new Error("Sua sessão expirou. Faça login novamente.");
        }

        if (resposta.status === 403) {
          throw new Error("Você não tem permissão para analisar propostas.");
        }

        throw new Error(
          resultado.erro ||
            resultado.message ||
            "Não foi possível concluir a análise."
        );
      }

      await carregarProposta();

      setMostrarRecusa(false);
      setMotivoRecusa("");

      alert(
        acao === "aprovar"
          ? "Proposta aprovada com sucesso!"
          : "Proposta rejeitada com sucesso!"
      );
    } catch (e) {
      setErro(e.message || "Não foi possível concluir a análise.");
    } finally {
      setProcessando(false);
    }
  };

  const cancelarRecusa = () => {
    setMostrarRecusa(false);
    setMotivoRecusa("");
  };

  if (carregando) {
    return (
      <main className="admin-detalhes-page">
        <div className="admin-detalhes-container">
          <p className="admin-detalhes-mensagem">Carregando proposta...</p>
        </div>
      </main>
    );
  }

  if (erro && !proposta) {
    return (
      <main className="admin-detalhes-page">
        <div className="admin-detalhes-container">
          <div className="admin-detalhes-voltar">
            <Link to="/admin/propostas">← Voltar para propostas</Link>
          </div>

          <div className="admin-detalhes-erro" role="alert">
            <p>{erro}</p>
            <button type="button" onClick={carregarProposta}>
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  const dadosProposta = extrairProposta(proposta?.proposta);
  const status = proposta?.status || "PENDENTE";
  const statusTexto = {
    PENDENTE: "Aguardando análise",
    APROVADA: "Aprovada",
    REJEITADA: "Rejeitada",
  };

  const statusClasse = {
    PENDENTE: "status-pendente",
    APROVADA: "status-aprovada",
    REJEITADA: "status-rejeitada",
  };

  return (
    <main className="admin-detalhes-page">
      <div className="admin-detalhes-container">
        <div className="admin-detalhes-voltar">
          <Link to="/admin/propostas">← Voltar para propostas</Link>
        </div>

        {erro && (
          <div className="admin-detalhes-erro" role="alert">
            {erro}
          </div>
        )}

        <section className="admin-detalhes-topo">
          <div>
            <span className="admin-detalhes-label">
              Proposta #{proposta.id}
            </span>

            <h1>{proposta.nomeFantasia || proposta.razaoSocial}</h1>

            <p>
              Analise os dados da empresa e a proposta enviada para o Raiz Urbana.
            </p>
          </div>

          <span className={`admin-detalhes-status ${statusClasse[status] || "status-pendente"}`}>
            {statusTexto[status] || status}
          </span>
        </section>

        <section className="admin-detalhes-card">
          <h2>Dados da empresa</h2>

          <div className="admin-detalhes-grid">
            <div className="admin-detalhes-dado">
              <span>Razão Social</span>
              <strong>{proposta.razaoSocial || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Nome Fantasia</span>
              <strong>{proposta.nomeFantasia || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>CNPJ</span>
              <strong>{formatarCNPJ(proposta.cnpj)}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Responsável</span>
              <strong>{proposta.responsavel || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>E-mail</span>
              <strong>{proposta.email || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Telefone</span>
              <strong>{formatarTelefone(proposta.telefone)}</strong>
            </div>
          </div>
        </section>

        <section className="admin-detalhes-card">
          <h2>Endereço da empresa</h2>

          <div className="admin-detalhes-grid">
            <div className="admin-detalhes-dado">
              <span>CEP</span>
              <strong>{formatarCEP(proposta.cep)}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Número</span>
              <strong>{proposta.numero || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado admin-detalhes-largo">
              <span>Rua / Avenida</span>
              <strong>{proposta.rua || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Bairro</span>
              <strong>{proposta.bairro || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Cidade / Estado</span>
              <strong>
                {[proposta.cidade, proposta.estado].filter(Boolean).join(" - ") ||
                  "Não informado"}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-detalhes-card">
          <h2>Proposta de parceria</h2>

          <div className="admin-detalhes-proposta">
            <div className="admin-detalhes-dado">
              <span>Tipo de parceria</span>
              <strong>{traduzirTipo(dadosProposta.tipoParceria)}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Data de envio</span>
              <strong>{formatarData(proposta.dataEnvio)}</strong>
            </div>

            <div className="admin-detalhes-descricao">
              <span>Descrição da proposta</span>
              <p>{dadosProposta.descricao}</p>
            </div>
          </div>
        </section>

        {status === "PENDENTE" && (
          <section className="admin-detalhes-card admin-analise-card">
            <h2>Análise da proposta</h2>

            <p className="admin-analise-descricao">
              Confira as informações e escolha se a empresa será aprovada como
              parceira do Raiz Urbana.
            </p>

            {!mostrarRecusa && (
              <div className="admin-analise-acoes">
                <button
                  type="button"
                  className="admin-recusar"
                  onClick={() => setMostrarRecusa(true)}
                  disabled={processando}
                >
                  Rejeitar proposta
                </button>

                <button
                  type="button"
                  className="admin-aprovar"
                  onClick={() => executarAnalise("aprovar")}
                  disabled={processando}
                >
                  {processando ? "Processando..." : "Aprovar proposta"}
                </button>
              </div>
            )}

            {mostrarRecusa && (
              <div className="admin-recusa-container">
                <label htmlFor="motivoRecusa">Motivo da rejeição</label>

                <textarea
                  id="motivoRecusa"
                  value={motivoRecusa}
                  onChange={(e) => setMotivoRecusa(e.target.value)}
                  placeholder="Explique o motivo da rejeição da proposta..."
                  rows={5}
                  maxLength={2000}
                  required
                  disabled={processando}
                />

                <div className="admin-recusa-acoes">
                  <button
                    type="button"
                    className="admin-cancelar-recusa"
                    onClick={cancelarRecusa}
                    disabled={processando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="admin-confirmar-recusa"
                    onClick={() => executarAnalise("rejeitar")}
                    disabled={processando || !motivoRecusa.trim()}
                  >
                    {processando ? "Processando..." : "Confirmar rejeição"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {status === "APROVADA" && (
          <div className="admin-resultado admin-resultado-aprovado">
            <div>✓</div>

            <section>
              <strong>Empresa aprovada</strong>
              <p>
                Esta empresa foi aprovada para participar do programa de parceiros
                do Raiz Urbana.
              </p>
              {proposta.dataAnalise && (
                <p>Data da análise: {formatarData(proposta.dataAnalise)}</p>
              )}
            </section>
          </div>
        )}

        {status === "REJEITADA" && (
          <div className="admin-resultado admin-resultado-recusado">
            <div>×</div>

            <section>
              <strong>Proposta rejeitada</strong>
              <p>Esta proposta foi rejeitada pela administração.</p>

              {proposta.feedback && (
                <p>
                  <b>Motivo:</b> {proposta.feedback}
                </p>
              )}

              {proposta.dataAnalise && (
                <p>Data da análise: {formatarData(proposta.dataAnalise)}</p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPropostaDetalhes;
