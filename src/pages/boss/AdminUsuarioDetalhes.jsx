import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../../services/api";
import "./AdminUsuarioDetalhes.css";

function AdminUsuarioDetalhes() {
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [alterandoTipo, setAlterandoTipo] = useState(false);

  const [erro, setErro] = useState("");

  // ==========================================
  // TOKEN
  // ==========================================

  const obterToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // ==========================================
  // BUSCAR DADOS
  // ==========================================

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      const token = obterToken();

      if (!token) {
        throw new Error(
          "Token de autenticação não encontrado."
        );
      }

      // ==========================================
      // BUSCAR USUÁRIO
      // ==========================================

      const respostaUsuario = await fetch(
        `${API_URL}/api/usuarios/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let dadosUsuario = null;

      try {
        dadosUsuario = await respostaUsuario.json();
      } catch {
        dadosUsuario = null;
      }

      if (!respostaUsuario.ok) {
        throw new Error(
          dadosUsuario?.message ||
            dadosUsuario?.mensagem ||
            "Não foi possível carregar o usuário."
        );
      }

      setUsuario(dadosUsuario);

      // ==========================================
      // BUSCAR SOLICITAÇÕES
      // ==========================================

      const respostaSolicitacoes = await fetch(
        `${API_URL}/api/solicitacoes/usuario/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let dadosSolicitacoes = [];

      try {
        dadosSolicitacoes =
          await respostaSolicitacoes.json();
      } catch {
        dadosSolicitacoes = [];
      }

      if (!respostaSolicitacoes.ok) {
        throw new Error(
          dadosSolicitacoes?.message ||
            dadosSolicitacoes?.mensagem ||
            "Não foi possível carregar as solicitações do usuário."
        );
      }

      setSolicitacoes(
        Array.isArray(dadosSolicitacoes)
          ? dadosSolicitacoes
          : []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar detalhes do usuário:",
        error
      );

      setErro(
        error.message ||
          "Não foi possível carregar os dados."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  // ==========================================
  // TRANSFORMAR EM GESTOR
  // ==========================================

  const transformarEmGestor = async () => {
    if (!usuario) {
      return;
    }

    const bairroAtuacao = window.prompt(
      "Informe o bairro de atuação deste gestor:",
      usuario.bairro || ""
    );

    if (bairroAtuacao === null) {
      return;
    }

    const bairroNormalizado = bairroAtuacao.trim();

    if (!bairroNormalizado) {
      alert(
        "O bairro de atuação é obrigatório."
      );
      return;
    }

    const confirmar = window.confirm(
      `Deseja transformar ${usuario.nomeCompleto} em GESTOR do bairro ${bairroNormalizado}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setAlterandoTipo(true);

      const token = obterToken();

      if (!token) {
        throw new Error(
          "Token de autenticação não encontrado."
        );
      }

      const response = await fetch(
        `${API_URL}/api/usuarios/${id}/gestor`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bairroAtuacao: bairroNormalizado,
          }),
        }
      );

      let resposta = null;

      try {
        resposta = await response.json();
      } catch {
        resposta = null;
      }

      if (!response.ok) {
        throw new Error(
          resposta?.message ||
            resposta?.mensagem ||
            "Não foi possível transformar o usuário em gestor."
        );
      }

      setUsuario(resposta);

      alert(
        "Usuário transformado em gestor com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao transformar usuário em gestor:",
        error
      );

      alert(
        error.message ||
          "Não foi possível alterar o tipo da conta."
      );
    } finally {
      setAlterandoTipo(false);
    }
  };

  // ==========================================
  // TRANSFORMAR EM USUÁRIO
  // ==========================================

  const transformarEmUsuario = async () => {
    if (!usuario) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja transformar ${usuario.nomeCompleto} novamente em USUÁRIO?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setAlterandoTipo(true);

      const token = obterToken();

      if (!token) {
        throw new Error(
          "Token de autenticação não encontrado."
        );
      }

      const response = await fetch(
        `${API_URL}/api/usuarios/${id}/usuario`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let resposta = null;

      try {
        resposta = await response.json();
      } catch {
        resposta = null;
      }

      if (!response.ok) {
        throw new Error(
          resposta?.message ||
            resposta?.mensagem ||
            "Não foi possível transformar o gestor em usuário."
        );
      }

      setUsuario(resposta);

      alert(
        "Gestor transformado em usuário com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao transformar gestor em usuário:",
        error
      );

      alert(
        error.message ||
          "Não foi possível alterar o tipo da conta."
      );
    } finally {
      setAlterandoTipo(false);
    }
  };

  // ==========================================
  // STATUS
  // ==========================================

  const traduzirStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";

      case "EM_ANALISE":
        return "Em análise";

      case "VISITA_AGENDADA":
        return "Visita agendada";

      case "APROVADO":
        return "Aprovado";

      case "CONCLUIDO":
        return "Concluído";

      case "RECUSADO":
        return "Recusado";

      default:
        return status || "Não informado";
    }
  };

  const classeStatus = (status) => {
    switch (status) {
      case "PENDENTE":
        return "admin-usuario-status-pendente";

      case "EM_ANALISE":
        return "admin-usuario-status-analise";

      case "VISITA_AGENDADA":
        return "admin-usuario-status-visita";

      case "APROVADO":
        return "admin-usuario-status-aprovado";

      case "CONCLUIDO":
        return "admin-usuario-status-concluido";

      case "RECUSADO":
        return "admin-usuario-status-recusado";

      default:
        return "";
    }
  };

  // ==========================================
  // TIPO DA CONTA
  // ==========================================

  const traduzirTipo = (tipo) => {
    switch (tipo) {
      case "USUARIO":
        return "Usuário";

      case "GESTOR":
        return "Gestor";

      case "BOSS":
        return "Boss";

      default:
        return tipo || "Não informado";
    }
  };

  const classeTipo = (tipo) => {
    switch (tipo) {
      case "USUARIO":
        return "admin-usuario-tipo-usuario";

      case "GESTOR":
        return "admin-usuario-tipo-gestor";

      case "BOSS":
        return "admin-usuario-tipo-boss";

      default:
        return "";
    }
  };

  // ==========================================
  // DATA
  // ==========================================

  const formatarData = (data) => {
    if (!data) {
      return "Não informado";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return data;
    }

    return dataConvertida.toLocaleDateString(
      "pt-BR"
    );
  };

  // ==========================================
  // RESUMO
  // ==========================================

  const totalEmAnalise = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "PENDENTE" ||
      solicitacao.status === "EM_ANALISE" ||
      solicitacao.status === "VISITA_AGENDADA"
  ).length;

  const totalConcluidas = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.status === "APROVADO" ||
      solicitacao.status === "CONCLUIDO"
  ).length;

  // ==========================================
  // CARREGAMENTO
  // ==========================================

  if (carregando) {
    return (
      <main className="admin-usuario-detalhes-page">
        <div className="admin-usuario-detalhes-container">
          <div className="admin-usuario-detalhes-voltar">
            <Link to="/admin/usuarios">
              ← Voltar para usuários
            </Link>
          </div>

          <div className="admin-usuario-carregando">
            Carregando dados do usuário...
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERRO
  // ==========================================

  if (erro || !usuario) {
    return (
      <main className="admin-usuario-detalhes-page">
        <div className="admin-usuario-detalhes-container">
          <div className="admin-usuario-detalhes-voltar">
            <Link to="/admin/usuarios">
              ← Voltar para usuários
            </Link>
          </div>

          <div className="admin-usuario-erro">
            <h2>
              Não foi possível carregar o usuário
            </h2>

            <p>
              {erro ||
                "Usuário não encontrado."}
            </p>

            <button
              type="button"
              onClick={carregarDados}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-usuario-detalhes-page">
      <div className="admin-usuario-detalhes-container">
        <div className="admin-usuario-detalhes-voltar">
          <Link to="/admin/usuarios">
            ← Voltar para usuários
          </Link>
        </div>

        {/* ======================================
            TOPO
        ====================================== */}

        <section className="admin-usuario-detalhes-topo">
          <div className="admin-usuario-detalhes-avatar">
            👤
          </div>

          <div className="admin-usuario-detalhes-topo-info">
            <span className="admin-usuario-detalhes-label">
              Conta #{usuario.id}
            </span>

            <div className="admin-usuario-nome-tipo">
              <h1>{usuario.nomeCompleto}</h1>

              <span
                className={`admin-usuario-tipo ${classeTipo(
                  usuario.tipo
                )}`}
              >
                {traduzirTipo(usuario.tipo)}
              </span>
            </div>

            <p>
              Visualize os dados da conta e o histórico
              de solicitações.
            </p>
          </div>
        </section>

        {/* ======================================
            AÇÕES ADMINISTRATIVAS
        ====================================== */}

        {usuario.tipo !== "BOSS" && (
          <section className="admin-usuario-gerenciamento">
            <div>
              <span className="admin-usuario-gerenciamento-label">
                Gerenciamento de acesso
              </span>

              <h2>
                Tipo da conta
              </h2>

              {usuario.tipo === "USUARIO" && (
                <p>
                  Esta conta possui acesso de usuário.
                  Você pode transformá-la em gestor e
                  definir o bairro de atuação.
                </p>
              )}

              {usuario.tipo === "GESTOR" && (
                <p>
                  Este gestor atua atualmente em{" "}
                  <strong>
                    {usuario.bairroAtuacao ||
                      "bairro não informado"}
                  </strong>
                  . Você pode remover o acesso de gestor
                  e transformá-lo novamente em usuário.
                </p>
              )}
            </div>

            <div className="admin-usuario-gerenciamento-acoes">
              {usuario.tipo === "USUARIO" && (
                <button
                  type="button"
                  className="admin-usuario-btn-gestor"
                  onClick={transformarEmGestor}
                  disabled={alterandoTipo}
                >
                  {alterandoTipo
                    ? "Alterando..."
                    : "Tornar gestor"}
                </button>
              )}

              {usuario.tipo === "GESTOR" && (
                <button
                  type="button"
                  className="admin-usuario-btn-usuario"
                  onClick={transformarEmUsuario}
                  disabled={alterandoTipo}
                >
                  {alterandoTipo
                    ? "Alterando..."
                    : "Tornar usuário"}
                </button>
              )}
            </div>
          </section>
        )}

        {usuario.tipo === "BOSS" && (
          <section className="admin-usuario-boss-aviso">
            <div className="admin-usuario-boss-aviso-icon">
              🛡️
            </div>

            <div>
              <strong>Conta administrativa BOSS</strong>

              <p>
                O tipo desta conta não pode ser alterado
                por esta página.
              </p>
            </div>
          </section>
        )}

        {/* ======================================
            RESUMO
        ====================================== */}

        <section className="admin-usuario-detalhes-resumo">
          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🌱
            </div>

            <div>
              <strong>{solicitacoes.length}</strong>
              <span>Solicitações</span>
            </div>
          </div>

          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🔎
            </div>

            <div>
              <strong>{totalEmAnalise}</strong>
              <span>Em andamento</span>
            </div>
          </div>

          <div className="admin-usuario-resumo-card">
            <div className="admin-usuario-resumo-icon">
              🌳
            </div>

            <div>
              <strong>{totalConcluidas}</strong>
              <span>Aprovadas / concluídas</span>
            </div>
          </div>
        </section>

        {/* ======================================
            DADOS PESSOAIS
        ====================================== */}

        <section className="admin-usuario-detalhes-card">
          <h2>Dados pessoais</h2>

          <div className="admin-usuario-detalhes-grid">
            <div className="admin-usuario-detalhe-dado">
              <span>Nome completo</span>
              <strong>
                {usuario.nomeCompleto ||
                  "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>CPF</span>
              <strong>
                {usuario.cpf || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>E-mail</span>
              <strong>
                {usuario.email || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Telefone</span>
              <strong>
                {usuario.telefone ||
                  "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Tipo da conta</span>

              <strong>
                {traduzirTipo(usuario.tipo)}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Conta criada em</span>

              <strong>
                {formatarData(usuario.createdAt)}
              </strong>
            </div>

            {usuario.tipo === "GESTOR" && (
              <>
                <div className="admin-usuario-detalhe-dado">
                  <span>Bairro de atuação</span>

                  <strong>
                    {usuario.bairroAtuacao ||
                      "Não informado"}
                  </strong>
                </div>

                <div className="admin-usuario-detalhe-dado">
                  <span>Instituição</span>

                  <strong>
                    {usuario.instituicao ||
                      "Não informado"}
                  </strong>
                </div>

                <div className="admin-usuario-detalhe-dado admin-usuario-detalhe-largo">
                  <span>
                    E-mail institucional
                  </span>

                  <strong>
                    {usuario.emailInstitucional ||
                      "Não informado"}
                  </strong>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ======================================
            ENDEREÇO
        ====================================== */}

        <section className="admin-usuario-detalhes-card">
          <h2>Endereço</h2>

          <div className="admin-usuario-detalhes-grid">
            <div className="admin-usuario-detalhe-dado">
              <span>CEP</span>
              <strong>
                {usuario.cep || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Número</span>
              <strong>
                {usuario.numero || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado admin-usuario-detalhe-largo">
              <span>Rua / Avenida</span>

              <strong>
                {usuario.rua || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Bairro</span>

              <strong>
                {usuario.bairro || "Não informado"}
              </strong>
            </div>

            <div className="admin-usuario-detalhe-dado">
              <span>Cidade / Estado</span>

              <strong>
                {usuario.cidade || "Não informado"}
                {usuario.estado
                  ? ` - ${usuario.estado}`
                  : ""}
              </strong>
            </div>
          </div>
        </section>

        {/* ======================================
            SOLICITAÇÕES
        ====================================== */}

        <section className="admin-usuario-detalhes-card">
          <div className="admin-usuario-solicitacoes-header">
            <div>
              <h2>Solicitações da conta</h2>

              <p>
                Histórico de solicitações realizadas por
                esta conta.
              </p>
            </div>
          </div>

          <div className="admin-usuario-solicitacoes">
            {solicitacoes.length === 0 && (
              <div className="admin-usuario-sem-solicitacoes">
                Esta conta ainda não realizou nenhuma
                solicitação de plantio.
              </div>
            )}

            {solicitacoes.map((solicitacao) => (
              <article
                key={solicitacao.id}
                className="admin-usuario-solicitacao-item"
              >
                <div className="admin-usuario-solicitacao-principal">
                  <div className="admin-usuario-solicitacao-icon">
                    🌱
                  </div>

                  <div>
                    <span>Protocolo</span>

                    <h3>
                      {solicitacao.protocolo}
                    </h3>

                    <p>
                      {solicitacao.ruaAvenida ||
                        "Endereço não informado"}
                    </p>
                  </div>
                </div>

                <div className="admin-usuario-solicitacao-dado">
                  <span>Bairro</span>

                  <strong>
                    {solicitacao.bairro ||
                      "Não informado"}
                  </strong>
                </div>

                <div className="admin-usuario-solicitacao-dado">
                  <span>Data</span>

                  <strong>
                    {formatarData(
                      solicitacao.dataSolicitacao
                    )}
                  </strong>
                </div>

                <div className="admin-usuario-solicitacao-final">
                  <span
                    className={`admin-usuario-solicitacao-status ${classeStatus(
                      solicitacao.status
                    )}`}
                  >
                    {traduzirStatus(
                      solicitacao.status
                    )}
                  </span>

                  <Link
                    to={`/admin/solicitacoes/${solicitacao.id}`}
                    className="admin-usuario-solicitacao-ver"
                  >
                    Visualizar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminUsuarioDetalhes;