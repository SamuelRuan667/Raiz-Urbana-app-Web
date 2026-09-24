import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const [busca, setBusca] = useState("");

  const [usuarios] = useState([
    {
      id: 1,
      nomeCompleto: "Usuário Exemplo",
      cpf: "000.000.000-00",
      email: "usuario@exemplo.com",
      telefone: "(81) 99999-9999",
      bairro: "Boa Viagem",
      cidade: "Recife",
      estado: "PE",
    },
    {
      id: 2,
      nomeCompleto: "Usuário Teste",
      cpf: "111.111.111-11",
      email: "teste@exemplo.com",
      telefone: "(81) 98888-8888",
      bairro: "Casa Amarela",
      cidade: "Recife",
      estado: "PE",
    },
    {
      id: 3,
      nomeCompleto: "Outro Usuário",
      cpf: "222.222.222-22",
      email: "outro@exemplo.com",
      telefone: "(81) 97777-7777",
      bairro: "Madalena",
      cidade: "Recife",
      estado: "PE",
    },
  ]);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      usuario.nomeCompleto.toLowerCase().includes(termo) ||
      usuario.cpf.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.bairro.toLowerCase().includes(termo)
    );
  });

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
            Consulte os usuários cadastrados na plataforma
            Raiz Urbana.
          </p>
        </section>

        <section className="admin-usuarios-resumo">
          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              👥
            </div>

            <div>
              <strong>{usuarios.length}</strong>
              <span>Usuários cadastrados</span>
            </div>
          </div>

          <div className="admin-usuarios-resumo-card">
            <div className="admin-usuarios-resumo-icon">
              📍
            </div>

            <div>
              <strong>
                {
                  new Set(
                    usuarios.map(
                      (usuario) => usuario.bairro
                    )
                  ).size
                }
              </strong>

              <span>Bairros com usuários</span>
            </div>
          </div>
        </section>

        <section className="admin-usuarios-card">
          <div className="admin-usuarios-ferramentas">
            <div>
              <h2>Usuários cadastrados</h2>

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
                placeholder="Nome, CPF, e-mail ou bairro"
              />
            </div>
          </div>

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
                    👤
                  </div>

                  <div>
                    <h3>
                      {usuario.nomeCompleto}
                    </h3>

                    <p>
                      {usuario.email}
                    </p>
                  </div>
                </div>

                <div className="admin-usuario-dado">
                  <span>CPF</span>

                  <strong>
                    {usuario.cpf}
                  </strong>
                </div>

                <div className="admin-usuario-dado">
                  <span>Telefone</span>

                  <strong>
                    {usuario.telefone}
                  </strong>
                </div>

                <div className="admin-usuario-dado">
                  <span>Bairro</span>

                  <strong>
                    {usuario.bairro}
                  </strong>
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
        </section>
      </div>
    </main>
  );
}

export default AdminUsuarios;