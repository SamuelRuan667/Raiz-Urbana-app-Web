import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminPropostas.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminPropostas() {
  const [filtro, setFiltro] = useState("TODAS");
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarPropostas = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Sua sessão não foi encontrada. Entre novamente como BOSS.");
      }

      const resposta = await fetch(
        `${API_URL}/api/propostas-parceria/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (resposta.status === 401 || resposta.status === 403) {
        throw new Error(
          "Você não tem autorização para consultar as propostas. Verifique se entrou com a conta BOSS."
        );
      }

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar as propostas.");
      }

      const dados = await resposta.json();

      setPropostas(Array.isArray(dados) ? dados : []);
    } catch (erroConsulta) {
      setErro(
        erroConsulta.message ||
          "Ocorreu um erro ao carregar as propostas."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPropostas();
  }, [carregarPropostas]);

  const propostasFiltradas =
    filtro === "TODAS"
      ? propostas
      : propostas.filter(
          (proposta) => proposta.status === filtro
        );

  const quantidadePendentes = propostas.filter(
    (proposta) => proposta.status === "PENDENTE"
  ).length;

  const quantidadeAprovadas = propostas.filter(
    (proposta) => proposta.status === "APROVADA"
  ).length;

  const quantidadeRecusadas = propostas.filter(
    (proposta) => proposta.status === "REJEITADA"
  ).length;

  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Aguardando análise";
      case "APROVADA":
        return "Aprovada";
      case "REJEITADA":
        return "Rejeitada";
      default:
        return status || "Não informado";
    }
  };

  const classeStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "admin-propostas-status-pendente";
      case "APROVADA":
        return "admin-propostas-status-aprovada";
      case "REJEITADA":
        return "admin-propostas-status-recusada";
      default:
        return "";
    }
  };

  const formatarCNPJ = (cnpj) => {
    const numeros = String(cnpj || "").replace(/\D/g, "");

    if (numeros.length !== 14) {
      return cnpj || "Não informado";
    }

    return numeros.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const formatarData = (data) => {
    if (!data) return "Não informado";

    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
      return data;
    }

    return dataValida.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  return (
    <main className="admin-propostas-page">
      <div className="admin-propostas-container">
        <div className="admin-propostas-voltar">
          <Link to="/admin">← Voltar ao painel</Link>
        </div>

        <section className="admin-propostas-topo">
          <span className="admin-propostas-label">Empresas</span>

          <h1>Propostas de parceria</h1>

          <p>
            Analise as propostas enviadas pelas empresas que
            desejam participar do Raiz Urbana.
          </p>
        </section>

        <section className="admin-propostas-resumo">
          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon">🤝</div>
            <div>
              <strong>{propostas.length}</strong>
              <span>Total de propostas</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon pendente">
              🔎
            </div>
            <div>
              <strong>{quantidadePendentes}</strong>
              <span>Aguardando análise</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon aprovada">
              ✓
            </div>
            <div>
              <strong>{quantidadeAprovadas}</strong>
              <span>Aprovadas</span>
            </div>
          </div>

          <div className="admin-propostas-resumo-card">
            <div className="admin-propostas-resumo-icon recusada">
              ×
            </div>
            <div>
              <strong>{quantidadeRecusadas}</strong>
              <span>Rejeitadas</span>
            </div>
          </div>
        </section>

        <section className="admin-propostas-conteudo">
          <div className="admin-propostas-header">
            <div>
              <h2>Propostas recebidas</h2>
              <p>
                Selecione uma proposta para visualizar todos os
                detalhes.
              </p>
            </div>

            <div className="admin-propostas-filtros">
              {[
                { valor: "TODAS", texto: "Todas" },
                { valor: "PENDENTE", texto: "Pendentes" },
                { valor: "APROVADA", texto: "Aprovadas" },
                { valor: "REJEITADA", texto: "Rejeitadas" },
              ].map((opcao) => (
                <button
                  key={opcao.valor}
                  type="button"
                  className={filtro === opcao.valor ? "ativo" : ""}
                  onClick={() => setFiltro(opcao.valor)}
                >
                  {opcao.texto}
                </button>
              ))}
            </div>
          </div>

          {erro && (
            <div className="admin-detalhes-erro" role="alert">
              <p>{erro}</p>
              <button type="button" onClick={carregarPropostas}>
                Tentar novamente
              </button>
            </div>
          )}

          {carregando ? (
            <div className="admin-propostas-vazio">
              Carregando propostas...
            </div>
          ) : !erro && propostasFiltradas.length === 0 ? (
            <div className="admin-propostas-vazio">
              Nenhuma proposta encontrada.
            </div>
          ) : (
            <div className="admin-propostas-lista">
              {propostasFiltradas.map((proposta) => (
                <div
                  key={proposta.id}
                  className="admin-propostas-item"
                >
                  <div className="admin-propostas-empresa">
                    <div className="admin-propostas-empresa-icon">
                      🏢
                    </div>

                    <div>
                      <h3>
                        {proposta.nomeFantasia ||
                          proposta.razaoSocial ||
                          "Empresa sem nome"}
                      </h3>

                      <p>{formatarCNPJ(proposta.cnpj)}</p>
                    </div>
                  </div>

                  <div className="admin-propostas-dado">
                    <span>Razão social</span>
                    <strong>
                      {proposta.razaoSocial || "Não informado"}
                    </strong>
                  </div>

                  <div className="admin-propostas-dado">
                    <span>Tipo de parceria</span>
                    <strong>
                      {proposta.tipoParceria ||
                        proposta.tipo ||
                        (proposta.proposta
                          ? proposta.proposta
                              .split("\n")[0]
                              .replace("Tipo de parceria: ", "")
                          : "Não informado")}
                    </strong>
                  </div>

                  <div className="admin-propostas-dado">
                    <span>Enviada em</span>
                    <strong>{formatarData(proposta.dataEnvio)}</strong>
                  </div>

                  <div className="admin-propostas-final">
                    <span
                      className={`admin-propostas-status ${classeStatus(
                        proposta.status
                      )}`}
                    >
                      {traduzirStatus(proposta.status)}
                    </span>

                    <Link
                      to={`/admin/propostas/${proposta.id}`}
                      className="admin-propostas-analisar"
                    >
                      {proposta.status === "PENDENTE"
                        ? "Analisar"
                        : "Visualizar"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminPropostas;