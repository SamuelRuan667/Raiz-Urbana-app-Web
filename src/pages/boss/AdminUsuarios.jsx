import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../services/api";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setCarregando(true);
        setErro("");

        const usuarioSalvo =
          localStorage.getItem("usuarioLogado") ||
          sessionStorage.getItem("usuarioLogado");

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (!usuarioSalvo || !token) {
          navigate("/login");
          return;
        }

        let usuarioLogado;

        try {
          usuarioLogado = JSON.parse(usuarioSalvo);
        } catch {
          localStorage.removeItem("usuarioLogado");
          localStorage.removeItem("token");
          sessionStorage.removeItem("usuarioLogado");
          sessionStorage.removeItem("token");

          navigate("/login");
          return;
        }

        if (usuarioLogado.tipo !== "BOSS") {
          navigate("/");
          return;
        }

        const resposta = await fetch(
          `${API_URL}/api/usuarios`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (resposta.status === 401) {
          localStorage.removeItem("usuarioLogado");
          localStorage.removeItem("token");
          sessionStorage.removeItem("usuarioLogado");
          sessionStorage.removeItem("token");

          navigate("/login");
          return;
        }

        if (resposta.status === 403) {
          throw new Error(
            "Você não possui permissão para visualizar os usuários."
          );
        }

        if (!resposta.ok) {
          let mensagemErro =
            "Não foi possível carregar os usuários.";

          try {
            const dadosErro = await resposta.json();

            mensagemErro =
              dadosErro?.message ||
              dadosErro?.mensagem ||
              mensagemErro;
          } catch {
            // Mantém a mensagem padrão.
          }

          throw new Error(mensagemErro);
        }

        const dados = await resposta.json();

        if (Array.isArray(dados)) {
          setUsuarios(dados);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar usuários:",
          error
        );

        setErro(
          error.message ||
            "Não foi possível carregar os usuários."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, [navigate]);

  const formatarTipo = (tipo) => {
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

  const usuariosFiltrados = useMemo(() => {
    const termo = busca
      .toLowerCase()
      .trim();

    if (!termo) {
      return usuarios;
    }

    return usuarios.filter((usuario) => {
      const nome = (
        usuario.nomeCompleto || ""
      ).toLowerCase();

      const cpf = (
        usuario.cpf || ""
      ).toLowerCase();

      const email = (
        usuario.email || ""
      ).toLowerCase();

      const bairro = (
        usuario.bairro || ""
      ).toLowerCase();

      const bairroAtuacao = (
        usuario.bairroAtuacao || ""
      ).toLowerCase();

      const tipo = (
        usuario.tipo || ""
      ).toLowerCase();

      return (
        nome.includes(termo) ||
        cpf.includes(termo) ||
        email.includes(termo) ||
        bairro.includes(termo) ||
        bairroAtuacao.includes(termo) ||
        tipo.includes(termo)
      );
    });
  }, [busca, usuarios]);

  const totalUsuarios = usuarios.filter(
    (usuario) => usuario.tipo === "USUARIO"
  ).length;

  const totalGestores = usuarios.filter(
    (usuario) => usuario.tipo === "GESTOR"
  ).length;

  const bairrosComUsuarios = new Set(
    usuarios
      .map((usuario) => usuario.bairro)
      .filter(
        (bairro) =>
          bairro &&
          bairro.trim() !== ""
      )
      .map((bairro) =>
        bairro.trim().toLowerCase()
      )
  ).size;

  if (carregando) {
    return (
      <main className="admin-usuarios-page">
        <div className="admin-usuarios-container">
          <div className="admin-usuarios-voltar">
            <Link to="/admin">
              ← Voltar ao painel
            </Link>
          </div>

          <section className="admin-usuarios-topo">
            <span className="admin-usuarios-label">
              Administração
            </span>

            <h1>Usuários</h1>

            <p>
              Carregando usuários cadastrados...
            </p>
          </section>

          <section className="admin-usuarios-card">
            <div className="admin-usuarios-carregando">
              Carregando usuários...
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-usuarios-page">
      <div className="admin-usuarios-container">
        <div className="admin-usuarios-voltar">
          <Link to="/admin">
            ← Voltar ao painel
          </Link>
        </div>

        <section className="admin-usuarios-topo">
          <span className="admin-usuarios-label">
            Administração
          </span>

          <h1>Usuários</h1>

          <p>
            Consulte os usuários cadastrados e gerencie
            os tipos de conta da plataforma Raiz Urbana.
          </p>
        </section>

        <section className="admin-usuarios-resumo">
          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              👥
            </div>

            <div>
              <strong>
                {usuarios.length}
              </strong>

              <span>
                Contas cadastradas
              </span>
            </div>
          </div>

          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              👤
            </div>

            <div>
              <strong>
                {totalUsuarios}
              </strong>

              <span>
                Usuários
              </span>
            </div>
          </div>

          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              🛡️
            </div>

            <div>
              <strong>
                {totalGestores}
              </strong>

              <span>
                Gestores
              </span>
            </div>
          </div>

          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              📍
            </div>

            <div>
              <strong>
                {bairrosComUsuarios}
              </strong>

              <span>
                Bairros com usuários
              </span>
            </div>
          </div>
        </section>

        <section className="admin-usuarios-card">
          <div className="admin-usuarios-ferramentas">
            <div>
              <h2>
                Contas cadastradas
              </h2>

              <p>
                Pesquise e visualize os dados das contas.
              </p>
            </div>

            <div className="admin-usuarios-busca">
              <label htmlFor="buscaUsuario">
                Buscar usuário
              </label>

              <input
                type="text"
                id="buscaUsuario"
                value={busca}
                onChange={(e) =>
                  setBusca(e.target.value)
                }
                placeholder="Nome, CPF, e-mail, bairro ou tipo"
              />
            </div>
          </div>

          {erro && (
            <div className="admin-usuarios-erro">
              <strong>
                Não foi possível carregar os usuários.
              </strong>

              <p>
                {erro}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!erro && (
            <div className="admin-usuarios-lista">
              {usuariosFiltrados.length === 0 && (
                <div className="admin-usuarios-vazio">
                  Nenhum usuário encontrado.
                </div>
              )}

              {usuariosFiltrados.map((usuario) => (
                <article
                  key={usuario.id}
                  className="admin-usuario-item"
                >
                  <div className="admin-usuario-principal">
                    <div className="admin-usuario-avatar">
                      {usuario.tipo === "BOSS"
                        ? "👑"
                        : usuario.tipo === "GESTOR"
                        ? "🛡️"
                        : "👤"}
                    </div>

                    <div>
                      <h3>
                        {usuario.nomeCompleto ||
                          "Nome não informado"}
                      </h3>

                      <p>
                        {usuario.email ||
                          "E-mail não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="admin-usuario-dado">
                    <span>CPF</span>

                    <strong>
                      {usuario.cpf ||
                        "Não informado"}
                    </strong>
                  </div>

                  <div className="admin-usuario-dado">
                    <span>Bairro</span>

                    <strong>
                      {usuario.bairro ||
                        "Não informado"}
                    </strong>
                  </div>

                  <div className="admin-usuario-dado">
                    <span>Tipo</span>

                    <span
                      className={`admin-usuario-tipo tipo-${(
                        usuario.tipo || "USUARIO"
                      ).toLowerCase()}`}
                    >
                      {formatarTipo(usuario.tipo)}
                    </span>

                    {usuario.tipo === "GESTOR" &&
                      usuario.bairroAtuacao && (
                        <small className="admin-usuario-bairro-atuacao">
                          Atua em:{" "}
                          {usuario.bairroAtuacao}
                        </small>
                      )}
                  </div>

                  <div className="admin-usuario-acoes">
                    <Link
                      to={`/admin/usuarios/${usuario.id}`}
                      className="admin-usuario-visualizar"
                    >
                      Visualizar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminUsuarios;