import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../services/api";
import "./DetalhesMinhaSolicitacao.css";

function DetalhesMinhaSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitacao, setSolicitacao] = useState(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let urlFotoTemporaria = "";

    async function carregarSolicitacao() {
      const usuarioSalvo =
        sessionStorage.getItem("usuarioLogado") ||
        localStorage.getItem("usuarioLogado");

      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!usuarioSalvo || !token) {
        sessionStorage.removeItem("usuarioLogado");
        sessionStorage.removeItem("token");

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");

        navigate("/login");
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const usuarioLogado = JSON.parse(usuarioSalvo);

        if (usuarioLogado.tipo !== "USUARIO") {
          if (usuarioLogado.tipo === "GESTOR") {
            navigate("/gestor");
          } else if (usuarioLogado.tipo === "BOSS") {
            navigate("/admin");
          } else {
            navigate("/login");
          }

          return;
        }

        const resposta = await fetch(
          `${API_URL}/api/solicitacoes/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resposta.status === 401) {
          sessionStorage.removeItem("usuarioLogado");
          sessionStorage.removeItem("token");

          localStorage.removeItem("usuarioLogado");
          localStorage.removeItem("token");

          navigate("/login");
          return;
        }

        if (resposta.status === 403) {
          throw new Error(
            "Você não tem permissão para acessar esta solicitação."
          );
        }

        if (resposta.status === 404) {
          throw new Error(
            "Solicitação não encontrada."
          );
        }

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar a solicitação."
          );
        }

        const dados = await resposta.json();

        if (
          dados.usuarioId &&
          Number(dados.usuarioId) !==
            Number(usuarioLogado.id)
        ) {
          throw new Error(
            "Esta solicitação não pertence à sua conta."
          );
        }

        setSolicitacao(dados);

        if (dados.possuiFoto) {
          try {
            const respostaFoto = await fetch(
              `${API_URL}/api/solicitacoes/${id}/foto`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (respostaFoto.ok) {
              const blob = await respostaFoto.blob();

              urlFotoTemporaria =
                URL.createObjectURL(blob);

              setFotoUrl(urlFotoTemporaria);
            } else {
              setFotoUrl("");
            }
          } catch (erroFoto) {
            console.error(
              "Erro ao carregar foto:",
              erroFoto
            );

            setFotoUrl("");
          }
        } else {
          setFotoUrl("");
        }
      } catch (error) {
        console.error(
          "Erro ao carregar solicitação:",
          error
        );

        setErro(
          error.message ||
            "Não foi possível carregar os dados da solicitação."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      carregarSolicitacao();
    }

    return () => {
      if (urlFotoTemporaria) {
        URL.revokeObjectURL(
          urlFotoTemporaria
        );
      }
    };
  }, [id, navigate]);

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

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return data;
    }

    return dataFormatada.toLocaleDateString(
      "pt-BR"
    );
  };

  const formatarDataHora = (data) => {
    if (!data) {
      return "Não informada";
    }

    const dataFormatada = new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return data;
    }

    const dataTexto =
      dataFormatada.toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

    const horaTexto =
      dataFormatada.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    return `${dataTexto} às ${horaTexto}`;
  };

  const mensagemStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Sua solicitação foi recebida e aguarda análise.";

      case "EM_ANALISE":
        return "Sua solicitação está sendo analisada pela equipe responsável.";

      case "VISITA_AGENDADA":
        return "Uma visita técnica foi agendada para avaliar o local.";

      case "APROVADO":
        return "Sua solicitação foi aprovada.";

      case "RECUSADO":
        return "Sua solicitação foi recusada após a análise.";

      case "CONCLUIDO":
        return "Sua solicitação foi concluída.";

      default:
        return "Acompanhe aqui as atualizações da sua solicitação.";
    }
  };

  if (carregando) {
    return (
      <main className="minha-solicitacao-page">
        <div className="minha-solicitacao-container">
          <p>
            Carregando solicitação...
          </p>
        </div>
      </main>
    );
  }

  if (erro || !solicitacao) {
    return (
      <main className="minha-solicitacao-page">
        <div className="minha-solicitacao-container">
          <Link
            to="/perfil"
            className="minha-solicitacao-voltar"
          >
            ← Voltar para o perfil
          </Link>

          <div className="minha-solicitacao-erro">
            <h2>
              Não foi possível abrir a solicitação
            </h2>

            <p>
              {erro ||
                "Solicitação não encontrada."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="minha-solicitacao-page">
      <div className="minha-solicitacao-container">
        <Link
          to="/perfil"
          className="minha-solicitacao-voltar"
        >
          ← Voltar para o perfil
        </Link>

        {/* TOPO */}

        <section className="minha-solicitacao-topo">
          <div>
            <span className="minha-solicitacao-label">
              Minha solicitação
            </span>

            <h1>
              {solicitacao.protocolo}
            </h1>

            <p>
              Enviada em{" "}
              {formatarData(
                solicitacao.dataSolicitacao
              )}
            </p>
          </div>

          <span
            className={`minha-solicitacao-status status-${(
              solicitacao.status ||
              "PENDENTE"
            ).toLowerCase()}`}
          >
            {formatarStatus(
              solicitacao.status
            )}
          </span>
        </section>

        {/* DADOS DO SOLICITANTE */}

        <section className="minha-solicitacao-card">
          <h2>Dados do solicitante</h2>

          <div className="minha-solicitacao-informacoes">
            <div className="minha-solicitacao-item">
              <span>Nome completo</span>

              <strong>
                {solicitacao.nomeCompleto ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>CPF</span>

              <strong>
                {solicitacao.cpf ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>E-mail</span>

              <strong>
                {solicitacao.email ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>Telefone</span>

              <strong>
                {solicitacao.telefone ||
                  "Não informado"}
              </strong>
            </div>
          </div>
        </section>

        {/* ENDEREÇO */}

        <section className="minha-solicitacao-card">
          <h2>Endereço do plantio</h2>

          <div className="minha-solicitacao-informacoes">
            <div className="minha-solicitacao-item">
              <span>CEP</span>

              <strong>
                {solicitacao.cep ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>Bairro</span>

              <strong>
                {solicitacao.bairro ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>Rua / Avenida</span>

              <strong>
                {solicitacao.ruaAvenida ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>Número</span>

              <strong>
                {solicitacao.numero ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item minha-solicitacao-item-largo">
              <span>
                Ponto de referência
              </span>

              <strong>
                {solicitacao.pontoReferencia ||
                  "Não informado"}
              </strong>
            </div>
          </div>
        </section>

        {/* INFORMAÇÕES DO PLANTIO */}

        <section className="minha-solicitacao-card">
          <h2>
            Informações da solicitação
          </h2>

          <div className="minha-solicitacao-informacoes">
            <div className="minha-solicitacao-item">
              <span>Tipo de local</span>

              <strong>
                {solicitacao.tipoLocal ||
                  "Não informado"}
              </strong>
            </div>

            <div className="minha-solicitacao-item">
              <span>Protocolo</span>

              <strong>
                {solicitacao.protocolo}
              </strong>
            </div>

            <div className="minha-solicitacao-item minha-solicitacao-item-largo">
              <span>Observações</span>

              <p>
                {solicitacao.observacoes ||
                  "Nenhuma observação informada."}
              </p>
            </div>
          </div>
        </section>

        {/* ACOMPANHAMENTO */}

        <section className="minha-solicitacao-card">
          <h2>
            Acompanhamento da solicitação
          </h2>

          <div className="minha-solicitacao-status-info">
            <div>
              <span>Status atual</span>

              <strong>
                {formatarStatus(
                  solicitacao.status
                )}
              </strong>
            </div>

            <p>
              {mensagemStatus(
                solicitacao.status
              )}
            </p>

            {solicitacao.status ===
              "VISITA_AGENDADA" &&
              solicitacao.dataVisita && (
                <div className="minha-solicitacao-visita">
                  <div className="minha-solicitacao-visita-icon">
                    📅
                  </div>

                  <div className="minha-solicitacao-visita-conteudo">
                    <span>
                      Data da visita técnica
                    </span>

                    <strong>
                      {formatarDataHora(
                        solicitacao.dataVisita
                      )}
                    </strong>

                    <p>
                      Procure estar disponível no
                      local no horário agendado para
                      receber a equipe responsável.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* FOTO */}

        <section className="minha-solicitacao-card">
          <h2>Foto do local</h2>

          <div className="minha-solicitacao-foto">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Local da solicitação de plantio"
                className="minha-solicitacao-foto-imagem"
              />
            ) : (
              <div className="minha-solicitacao-foto-placeholder">
                <span>📷</span>

                <p>
                  {solicitacao.possuiFoto
                    ? "Não foi possível carregar a foto."
                    : "Esta solicitação não possui foto."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetalhesMinhaSolicitacao;