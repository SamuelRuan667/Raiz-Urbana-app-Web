import { Link } from "react-router-dom";
import "./EditarPerfil.css";

function EditarPerfil() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <main className="editar-perfil-page">
      <div className="editar-perfil-container">

        <div className="editar-perfil-topo">
          <span className="editar-perfil-label">
            Minha conta
          </span>

          <h1>Editar perfil</h1>

          <p>
            Atualize suas informações pessoais e dados de contato.
          </p>
        </div>

        <form
          className="editar-perfil-card"
          onSubmit={handleSubmit}
        >

          <section className="editar-perfil-section">
            <h2>Informações pessoais</h2>

            <div className="editar-perfil-grid">

              <div className="editar-perfil-field campo-largo">
                <label htmlFor="nome">
                  Nome completo
                </label>

                <input
                  type="text"
                  id="nome"
                  defaultValue="Samuel"
                  required
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="cpf">
                  CPF
                </label>

                <input
                  type="text"
                  id="cpf"
                  defaultValue="000.000.000-00"
                  disabled
                />

                <small>
                  O CPF não pode ser alterado.
                </small>
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="telefone">
                  Telefone
                </label>

                <input
                  type="tel"
                  id="telefone"
                  defaultValue="(81) 99999-9999"
                  required
                />
              </div>

              <div className="editar-perfil-field campo-largo">
                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  type="email"
                  id="email"
                  defaultValue="samuel@email.com"
                  required
                />
              </div>

            </div>
          </section>

          <section className="editar-perfil-section">
            <h2>Endereço</h2>

            <div className="editar-perfil-grid">

              <div className="editar-perfil-field">
                <label htmlFor="cep">
                  CEP
                </label>

                <input
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="numero">
                  Número
                </label>

                <input
                  type="text"
                  id="numero"
                  placeholder="Número"
                />
              </div>

              <div className="editar-perfil-field campo-largo">
                <label htmlFor="rua">
                  Rua / Avenida
                </label>

                <input
                  type="text"
                  id="rua"
                  placeholder="Rua ou avenida"
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="bairro">
                  Bairro
                </label>

                <input
                  type="text"
                  id="bairro"
                  placeholder="Bairro"
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="cidade">
                  Cidade
                </label>

                <input
                  type="text"
                  id="cidade"
                  defaultValue="Recife"
                />
              </div>

            </div>
          </section>

          <div className="editar-perfil-acoes">

            <Link
              to="/perfil"
              className="editar-perfil-cancelar"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="editar-perfil-salvar"
            >
              Salvar alterações
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}

export default EditarPerfil;