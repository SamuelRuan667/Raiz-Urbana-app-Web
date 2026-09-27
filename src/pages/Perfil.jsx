import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
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

        const usuarioLogado = JSON.parse(usuarioSalvo);

        if (
          usuarioLogado.tipo === "GESTOR" ||
          usuarioLogado.tipo === "BOSS"
        ) {
          navigate("/gestor");
          return;
        }

        setUsuario(usuarioLogado);

        // ==========================================
        // CARREGAR DADOS COMPLETOS DO USUÁRIO
        // ==========================================

        try {
          const respostaUsuario = await fetch(
            `${API_URL}/api/usuarios/${usuarioLogado.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (respostaUsuario.ok) {
            const dadosUsuario =
              await respostaUsuario.json();

            setUsuario(dadosUsuario);
          } else {
            console.error(
              "Erro ao carregar usuário. Status:",
              respostaUsuario.status
            );
          }
        } catch (erro) {
          console.error(
            "Erro ao carregar dados completos do usuário:",
            erro
          );
        }

        // ==========================================
        // CARREGAR SOLICITAÇÕES DO USUÁRIO
        // ==========================================

        try {
          const respostaSolicitacoes = await fetch(
            `${API_URL}/api/solicitacoes/usuario/${usuarioLogado.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (respostaSolicitacoes.ok) {
            const dadosSolicitacoes =
              await respostaSolicitacoes.json();

            setSolicitacoes(
              Array.isArray(dadosSolicitacoes)
                ? dadosSolicitacoes
                : []
            );
          } else {
            console.error(
              "Erro ao carregar solicitações. Status:",
              respostaSolicitacoes.status
            );

            setSolicitacoes([]);
          }
        } catch (erro) {
          console.error(
            "Erro ao carregar solicitações:",
            erro
          );

          setSolicitacoes([]);
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar perfil:",
          erro
        );

        sessionStorage.removeItem("usuarioLogado");
        sessionStorage.removeItem("token");

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");

        navigate("/login");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [navigate]);

  // ==========================================
  // SAIR DA CONTA
  // ==========================================

  const sairDaConta = () => {
    sessionStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("token");

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    window.dispatchEvent(
      new Event("usuarioLogadoAtualizado")
    );

    navigate("/login");
  };

  // ==========================================
  // RESUMO DAS SOLICITAÇÕES
  // ==========================================

  const totalSolicitacoes = solicitacoes.length;

  const totalEmAnalise = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "PENDENTE" ||
      solicitacao.status === "EM_ANALISE" ||
      solicitacao.status === "VISITA_AGENDADA"
  ).length;

  const totalConcluidas = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "CONCLUIDO" ||
      solicitacao.status === "APROVADO"
  ).length;

  // ==========================================
  // TRADUZIR STATUS
  // ==========================================

  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return {
          texto: "Pendente",
          classe: "status-pendente",
        };

      case "EM_ANALISE":
        return {
          texto: "Em análise",
          classe: "status-em_analise",
        };

      case "VISITA_AGENDADA":
        return {
          texto: "Visita agendada",
          classe: "status-visita_agendada",
        };

      case "APROVADO":
        return {
          texto: "Aprovado",
          classe: "status-aprovado",
        };

      case "RECUSADO":
        return {
          texto: "Recusado",
          classe: "status-recusado",
        };

      case "CONCLUIDO":
        return {
          texto: "Concluído",
          classe: "status-concluido",
        };

      default:
        return {
          texto: status || "Pendente",
          classe: "status-pendente",
        };
    }
  };

  // ==========================================
  // FORMATAR ENDEREÇO
  // ==========================================

  const formatarEndereco = () => {
    if (!usuario) {
      return "-";
    }

    const endereco = [
      usuario.rua,
      usuario.numero,
      usuario.bairro,
      usuario.cidade,
      usuario.estado,
    ].filter(Boolean);

    if (endereco.length === 0) {
      return "-";
    }

    return endereco.join(", ");
  };

  // ==========================================
  // CARREGAMENTO
  // ==========================================

  if (carregando) {
    return (
      <main className="perfil-page">
        <div className="perfil-container">
          <p>Carregando perfil...</p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return null;
  }

  // ==========================================
  // PÁGINA
  // ==========================================

  return (
    <main className="perfil-page">
      <div className="perfil-container">

        {/* =====================================
            PERFIL PRINCIPAL
        ====================================== */}

        <section className="perfil-card perfil-principal">
          <div className="perfil-avatar">
            👤
          </div>

          <div className="perfil-info">
            <span className="perfil-label">
              Meu perfil
            </span>

            <h1>
              {usuario.nomeCompleto || "Usuário"}
            </h1>

            <p>
              Acompanhe seus dados e suas solicitações de plantio.
            </p>
          </div>

          <div className="perfil-acoes">
            <Link
              to="/perfil/editar"
              className="perfil-editar"
            >
              Editar perfil
            </Link>

            <button
              type="button"
              className="perfil-sair"
              onClick={sairDaConta}
            >
              Sair da conta
            </button>
          </div>
        </section>

        {/* =====================================
            DADOS PESSOAIS
        ====================================== */}

        <section className="perfil-dados-card">
          <div className="perfil-section-header">
            <h2>Dados pessoais</h2>
          </div>

          <div className="perfil-dados-grid">

            <div className="perfil-dado">
              <span>Nome completo</span>

              <strong>
                {usuario.nomeCompleto || "-"}
              </strong>
            </div>

            <div className="perfil-dado">
              <span>CPF</span>

              <strong>
                {usuario.cpf || "-"}
              </strong>
            </div>

            <div className="perfil-dado">
              <span>E-mail</span>

              <strong>
                {usuario.email || "-"}
              </strong>
            </div>

            <div className="perfil-dado">
              <span>Telefone</span>

              <strong>
                {usuario.telefone || "-"}
              </strong>
            </div>

            <div className="perfil-dado perfil-dado-largo">
              <span>Endereço</span>

              <strong>
                {formatarEndereco()}
              </strong>
            </div>

          </div>
        </section>

        {/* =====================================
            RESUMO
        ====================================== */}

        <section className="perfil-resumo">

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">
              🌱
            </div>

            <div>
              <strong>
                {totalSolicitacoes}
              </strong>

              <p>Solicitações</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">
              🔎
            </div>

            <div>
              <strong>
                {totalEmAnalise}
              </strong>

              <p>Em análise</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">
              🌳
            </div>

            <div>
              <strong>
                {totalConcluidas}
              </strong>

              <p>Concluídas</p>
            </div>
          </div>

        </section>

        {/* =====================================
            MINHAS SOLICITAÇÕES
        ====================================== */}

        <section className="perfil-solicitacoes">
          <div className="perfil-section-header">
            <h2>Minhas solicitações</h2>
          </div>

          {solicitacoes.length === 0 && (
            <p
              style={{
                color: "#687168",
                padding: "15px 0",
              }}
            >
              Nenhuma solicitação enviada ainda.
            </p>
          )}

          {solicitacoes.map((item) => {
            const statusInfo =
              traduzirStatus(item.status);

            return (
              <div
                key={item.id || item.protocolo}
                className="perfil-solicitacao-item"
              >
                <div className="perfil-solicitacao-info">
                  <span className="solicitacao-protocolo">
                    {item.protocolo}
                  </span>

                  <h3>
                    Plantio em{" "}
                    {item.ruaAvenida ||
                      "Solicitação de plantio"}
                  </h3>

                  <p>
                    {item.bairro
                      ? `${item.bairro} - Recife, PE`
                      : "Recife - PE"}
                  </p>
                </div>

                <div className="perfil-solicitacao-acoes">
                  <span
                    className={`status ${statusInfo.classe}`}
                  >
                    {statusInfo.texto}
                  </span>

                  <Link
                    to={`/perfil/solicitacao/${item.id}`}
                    className="perfil-ver-detalhes"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </main>
  );
}

export default Perfil;