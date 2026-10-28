import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carteira, setCarteira] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [erroPropostas, setErroPropostas] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

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

        const requisicao = async (caminho) =>
          fetch(`${API_URL}${caminho}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

        const resultados = await Promise.allSettled([
          requisicao(`/api/usuarios/${usuarioLogado.id}`),
          requisicao(`/api/solicitacoes/usuario/${usuarioLogado.id}`),
          requisicao("/api/carteiras-capiba/minha"),
          requisicao("/api/carteiras-capiba/minha/movimentacoes"),
          requisicao("/api/propostas-parceria/minhas"),
        ]);

        if (!ativo) return;

        const [usuarioResultado, solicitacoesResultado, carteiraResultado, movimentacoesResultado, propostasResultado] =
          resultados;

        if (
          usuarioResultado.status === "fulfilled" &&
          usuarioResultado.value.ok
        ) {
          setUsuario(await usuarioResultado.value.json());
        }

        if (
          solicitacoesResultado.status === "fulfilled" &&
          solicitacoesResultado.value.ok
        ) {
          const dados = await solicitacoesResultado.value.json();
          setSolicitacoes(Array.isArray(dados) ? dados : []);
        } else {
          setSolicitacoes([]);
        }

        if (
          carteiraResultado.status === "fulfilled" &&
          carteiraResultado.value.ok
        ) {
          setCarteira(await carteiraResultado.value.json());
        } else {
          setCarteira(null);
        }

        if (
          movimentacoesResultado.status === "fulfilled" &&
          movimentacoesResultado.value.ok
        ) {
          const dados = await movimentacoesResultado.value.json();
          setMovimentacoes(Array.isArray(dados) ? dados : []);
        } else {
          setMovimentacoes([]);
        }

        if (
          propostasResultado.status === "fulfilled" &&
          propostasResultado.value.ok
        ) {
          const dados = await propostasResultado.value.json();
          setPropostas(Array.isArray(dados) ? dados : []);
          setErroPropostas("");
        } else {
          setPropostas([]);
          setErroPropostas(
            "Não foi possível carregar suas propostas. Tente novamente mais tarde."
          );
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);

        if (ativo) {
          setErroPropostas(
            "Ocorreu um erro ao carregar os dados do perfil."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  const sairDaConta = () => {
    sessionStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("usuarioLogadoAtualizado"));
    navigate("/login");
  };

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

  const saldoCapiba = carteira?.saldo ?? 0;

  const traduzirStatusSolicitacao = (status) => {
    switch (status) {
      case "PENDENTE":
        return { texto: "Pendente", classe: "status-pendente" };
      case "EM_ANALISE":
        return { texto: "Em análise", classe: "status-em_analise" };
      case "VISITA_AGENDADA":
        return { texto: "Visita agendada", classe: "status-visita_agendada" };
      case "APROVADO":
        return { texto: "Aprovado", classe: "status-aprovado" };
      case "RECUSADO":
        return { texto: "Recusado", classe: "status-recusado" };
      case "CONCLUIDO":
        return { texto: "Concluído", classe: "status-concluido" };
      default:
        return { texto: status || "Pendente", classe: "status-pendente" };
    }
  };

  const traduzirStatusProposta = (status) => {
    switch (status) {
      case "PENDENTE":
        return {
          texto: "Pendente",
          classe: "perfil-proposta-status-pendente",
        };
      case "APROVADA":
        return {
          texto: "Aprovada",
          classe: "perfil-proposta-status-aprovada",
        };
      case "REJEITADA":
        return {
          texto: "Rejeitada",
          classe: "perfil-proposta-status-rejeitada",
        };
      default:
        return {
          texto: status || "Não informado",
          classe: "perfil-proposta-status-pendente",
        };
    }
  };

  const traduzirTipoParceria = (proposta) => {
    const tipo =
      proposta.tipoParceria ||
      proposta.tipo ||
      proposta.proposta?.match(/Tipo de parceria:\s*(.+)/i)?.[1];

    const tipos = {
      BENEFICIOS: "Benefícios e descontos",
      PATROCINIO: "Patrocínio",
      APOIO_AMBIENTAL: "Apoio ambiental",
      DOACAO: "Doação",
      OUTRO: "Outro",
    };

    return tipos[tipo] || tipo || "Parceria";
  };

  const formatarData = (data) => {
    if (!data) return "Não informada";

    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
      return data;
    }

    return dataValida.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const formatarDataMovimentacao = (data) => {
    if (!data) return "-";

    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
      return "-";
    }

    return dataValida.toLocaleString("pt-BR");
  };

  const formatarEndereco = () => {
    if (!usuario) return "-";

    const endereco = [
      usuario.rua,
      usuario.numero,
      usuario.bairro,
      usuario.cidade,
      usuario.estado,
    ].filter(Boolean);

    return endereco.length ? endereco.join(", ") : "-";
  };

  if (carregando) {
    return (
      <main className="perfil-page">
        <div className="perfil-container">
          <p>Carregando perfil...</p>
        </div>
      </main>
    );
  }

  if (!usuario) return null;

  return (
    <main className="perfil-page">
      <div className="perfil-container">
        <section className="perfil-card perfil-principal">
          <div className="perfil-avatar">👤</div>

          <div className="perfil-info">
            <span className="perfil-label">Meu perfil</span>
            <h1>{usuario.nomeCompleto || "Usuário"}</h1>
            <p>
              Acompanhe seus dados e suas solicitações de plantio.
            </p>
          </div>

          <div className="perfil-acoes">
            <Link to="/perfil/editar" className="perfil-editar">
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

        <section className="perfil-dados-card">
          <div className="perfil-section-header">
            <h2>Dados pessoais</h2>
          </div>

          <div className="perfil-dados-grid">
            <div className="perfil-dado">
              <span>Nome completo</span>
              <strong>{usuario.nomeCompleto || "-"}</strong>
            </div>

            <div className="perfil-dado">
              <span>CPF</span>
              <strong>{usuario.cpf || "-"}</strong>
            </div>

            <div className="perfil-dado">
              <span>E-mail</span>
              <strong>{usuario.email || "-"}</strong>
            </div>

            <div className="perfil-dado">
              <span>Telefone</span>
              <strong>{usuario.telefone || "-"}</strong>
            </div>

            <div className="perfil-dado perfil-dado-largo">
              <span>Endereço</span>
              <strong>{formatarEndereco()}</strong>
            </div>
          </div>
        </section>

        <section className="perfil-resumo">
          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌱</div>
            <div>
              <strong>{totalSolicitacoes}</strong>
              <p>Solicitações</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🔎</div>
            <div>
              <strong>{totalEmAnalise}</strong>
              <p>Em análise</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">🌳</div>
            <div>
              <strong>{totalConcluidas}</strong>
              <p>Concluídas</p>
            </div>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-icon">⭐</div>
            <div>
              <strong>{saldoCapiba}</strong>
              <p>Moedas Capiba</p>
            </div>
          </div>
        </section>

        <section className="perfil-dados-card">
          <div className="perfil-section-header">
            <h2>Carteira Capiba</h2>
            <Link to="/recompensas" className="perfil-ver-detalhes">
              Ver recompensas
            </Link>
          </div>

          <div className="perfil-carteira-saldo">
            <span>Saldo disponível</span>
            <strong>⭐ {saldoCapiba} Moedas Capiba</strong>
            <p>
              Ganhe 20 moedas quando uma solicitação de plantio for concluída.
            </p>
          </div>

          <div className="perfil-movimentacoes">
            <h3>Histórico de movimentações</h3>

            {movimentacoes.length === 0 ? (
              <p className="perfil-sem-movimentacoes">
                Nenhuma movimentação realizada ainda.
              </p>
            ) : (
              movimentacoes.map((movimentacao) => (
                <div
                  key={movimentacao.id}
                  className="perfil-movimentacao-item"
                >
                  <div>
                    <strong>{movimentacao.descricao}</strong>
                    <span>
                      {formatarDataMovimentacao(movimentacao.createdAt)}
                    </span>
                  </div>

                  <strong
                    className={
                      movimentacao.tipo === "ENTRADA"
                        ? "movimentacao-entrada"
                        : "movimentacao-saida"
                    }
                  >
                    {movimentacao.tipo === "ENTRADA" ? "+" : "-"}
                    {movimentacao.quantidade}
                  </strong>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="perfil-propostas">
          <div className="perfil-section-header">
            <div>
              <h2>Minhas propostas de parceria</h2>
              <p className="perfil-propostas-descricao">
                Acompanhe a análise das propostas enviadas ao Raiz Urbana.
              </p>
            </div>
          </div>

          {erroPropostas ? (
            <p className="perfil-propostas-mensagem perfil-propostas-erro">
              {erroPropostas}
            </p>
          ) : propostas.length === 0 ? (
            <div className="perfil-propostas-vazio">
              <span className="perfil-propostas-vazio-icone">🤝</span>
              <h3>Nenhuma proposta encontrada</h3>
              <p>
                Quando você enviar uma proposta de parceria, poderá acompanhar
                o andamento dela nesta seção.
              </p>
              <Link to="/proposta-parceria" className="perfil-propostas-link">
                Enviar proposta de parceria
              </Link>
            </div>
          ) : (
            <div className="perfil-propostas-lista">
              {propostas.map((proposta) => {
                const statusInfo = traduzirStatusProposta(proposta.status);

                return (
                  <article
                    key={proposta.id}
                    className="perfil-proposta-item"
                  >
                    <div className="perfil-proposta-cabecalho">
                      <div className="perfil-proposta-empresa">
                        <span className="perfil-proposta-icone">🏢</span>
                        <div>
                          <h3>
                            {proposta.nomeFantasia ||
                              proposta.razaoSocial ||
                              "Proposta de parceria"}
                          </h3>
                          <p>{traduzirTipoParceria(proposta)}</p>
                        </div>
                      </div>

                      <span
                        className={`perfil-proposta-status ${statusInfo.classe}`}
                      >
                        {statusInfo.texto}
                      </span>
                    </div>

                    <div className="perfil-proposta-datas">
                      <span>
                        Enviada em: {formatarData(proposta.dataEnvio)}
                      </span>

                      {proposta.dataAnalise && (
                        <span>
                          Analisada em: {formatarData(proposta.dataAnalise)}
                        </span>
                      )}
                    </div>

                    {proposta.feedback && (
                      <div className="perfil-proposta-feedback">
                        <strong>Feedback da análise</strong>
                        <p>{proposta.feedback}</p>
                      </div>
                    )}

                    {proposta.status === "PENDENTE" && (
                      <p className="perfil-proposta-aviso">
                        Sua proposta está aguardando análise pela equipe.
                      </p>
                    )}

                    {proposta.status === "APROVADA" && (
                      <p className="perfil-proposta-sucesso">
                        Sua proposta foi aprovada. Obrigado por apoiar o
                        Raiz Urbana!
                      </p>
                    )}

                    {proposta.status === "REJEITADA" && (
                      <p className="perfil-proposta-aviso">
                        Sua proposta foi rejeitada. Consulte o feedback acima
                        para conhecer a justificativa, caso tenha sido informada.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="perfil-solicitacoes">
          <div className="perfil-section-header">
            <h2>Minhas solicitações</h2>
          </div>

          {solicitacoes.length === 0 && (
            <p className="perfil-lista-vazia">
              Nenhuma solicitação enviada ainda.
            </p>
          )}

          {solicitacoes.map((item) => {
            const statusInfo = traduzirStatusSolicitacao(item.status);

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
                    {item.ruaAvenida || "Solicitação de plantio"}
                  </h3>

                  <p>
                    {item.bairro
                      ? `${item.bairro} - Recife, PE`
                      : "Recife - PE"}
                  </p>
                </div>

                <div className="perfil-solicitacao-acoes">
                  <span className={`status ${statusInfo.classe}`}>
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
