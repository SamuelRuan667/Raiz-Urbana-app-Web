import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../services/api";
import "./DetalhesSolicitacao.css";

function DetalhesSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const usuarioSalvo =
      localStorage.getItem("usuarioLogado") ||
      sessionStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      if (
        usuario.tipo !== "GESTOR" &&
        usuario.tipo !== "BOSS"
      ) {
        navigate("/perfil");
      }
    } catch {
      localStorage.removeItem("usuarioLogado");
      sessionStorage.removeItem("usuarioLogado");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function carregarSolicitacao() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/api/solicitacoes/${id}`
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar a solicitação."
          );
        }

        const dados = await resposta.json();

        setSolicitacao(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar solicitação:",
          error
        );

        setErro(
          "Não foi possível carregar os dados da solicitação."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      carregarSolicitacao();
    }
  }, [id]);

  const atualizarStatus = async (novoStatus) => {
    try {
      setAtualizando(true);

      const resposta = await fetch(
        `${API_URL}/api/solicitacoes/${id}/status?status=${novoStatus}`,
        {
          method: "PATCH",
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível atualizar o status."
        );
      }

      const dadosAtualizados =
        await resposta.json();

      setSolicitacao(dadosAtualizados);

      alert("Status atualizado com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao atualizar status:",
        error
      );

      alert(
        error.message ||
          "Não foi possível atualizar a solicitação."
      );
    } finally {
      setAtualizando(false);
    }
  };

  const handleAprovar = () => {
    atualizarStatus("APROVADO");
  };

  const handleRecusar = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja recusar esta solicitação?"
    );

    if (!confirmar) {
      return;
    }

    atualizarStatus("RECUSADO");
  };

  const handleAnalise = () => {
    atualizarStatus("EM_ANALISE");
  };

  const formatarStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";

      case "EM_ANALISE":
        return "Em análise";

      case "VISITA_AGENDADA":
        return "Visita agendada";

      case "APROVADO":
        return "Aprovado";

      case "RECUSADO":
        return "Recusado";

      case "CONCLUIDO":
        return "Concluído";

      default:
        return status || "Pendente";
    }
  };

  const formatarData = (data) => {
    if (!data) {
      return "Não informada";
    }

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return data;
    }

    return dataFormatada.toLocaleDateString(
      "pt-BR"
    );
  };

  if (carregando) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container">
          <p>Carregando solicitação...</p>
        </div>
      </main>
    );
  }

  if (erro || !solicitacao) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container">
          <Link
            to="/gestor"
            className="detalhes-voltar"
          >
            ← Voltar para o painel
          </Link>

          <p>{erro || "Solicitação não encontrada."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="detalhes-page">
      <div className="detalhes-container">
        <Link
          to="/gestor"
          className="detalhes-voltar"
        >
          ← Voltar para o painel
        </Link>

        <section className="detalhes-topo">
          <div>
            <span className="detalhes-label">
              Solicitação de plantio
            </span>

            <h1>{solicitacao.protocolo}</h1>

            <p>
              Enviada em{" "}
              {formatarData(
                solicitacao.dataSolicitacao
              )}
            </p>
          </div>

          <span
            className={`detalhes-status status-${(
              solicitacao.status || "PENDENTE"
            ).toLowerCase()}`}
          >
            {formatarStatus(
              solicitacao.status
            )}
          </span>
        </section>

        <section className="detalhes-grid">
          <div className="detalhes-card">
            <h2>Dados do solicitante</h2>

            <div className="detalhes-informacoes">
              <div className="detalhes-item">
                <span>Nome completo</span>

                <strong>
                  {solicitacao.nomeCompleto ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item">
                <span>E-mail</span>

                <strong>
                  {solicitacao.email ||
                    "Não informado"}
                </strong>
              </div>
            </div>
          </div>

          <div className="detalhes-card">
            <h2>Endereço do plantio</h2>

            <div className="detalhes-informacoes">
              <div className="detalhes-item">
                <span>Bairro</span>

                <strong>
                  {solicitacao.bairro ||
                    "Não informado"}
                </strong>
              </div>

              <div className="detalhes-item detalhes-item-largo">
                <span>Rua / Avenida</span>

                <strong>
                  {solicitacao.ruaAvenida ||
                    "Não informado"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="detalhes-card detalhes-plantio">
          <h2>Informações da solicitação</h2>

          <div className="detalhes-informacoes">
            <div className="detalhes-item">
              <span>ID da solicitação</span>

              <strong>
                {solicitacao.id}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>Protocolo</span>

              <strong>
                {solicitacao.protocolo}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>Status atual</span>

              <strong>
                {formatarStatus(
                  solicitacao.status
                )}
              </strong>
            </div>

            <div className="detalhes-item">
              <span>Data da solicitação</span>

              <strong>
                {formatarData(
                  solicitacao.dataSolicitacao
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="detalhes-card detalhes-decisao">
          <div>
            <h2>Análise da solicitação</h2>

            <p>
              Atualize o status após analisar as
              informações da solicitação.
            </p>
          </div>

          <div className="detalhes-acoes">
            <button
              type="button"
              className="detalhes-btn detalhes-analise"
              onClick={handleAnalise}
              disabled={
                atualizando ||
                solicitacao.status ===
                  "EM_ANALISE"
              }
            >
              {atualizando
                ? "Atualizando..."
                : "Colocar em análise"}
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-recusar"
              onClick={handleRecusar}
              disabled={
                atualizando ||
                solicitacao.status === "RECUSADO"
              }
            >
              Recusar
            </button>

            <button
              type="button"
              className="detalhes-btn detalhes-aprovar"
              onClick={handleAprovar}
              disabled={
                atualizando ||
                solicitacao.status === "APROVADO"
              }
            >
              Aprovar solicitação
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetalhesSolicitacao;