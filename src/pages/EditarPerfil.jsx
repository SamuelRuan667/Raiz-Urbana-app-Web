import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./EditarPerfil.css";

function EditarPerfil() {
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    const usuarioSalvo =
      sessionStorage.getItem("usuarioLogado") ||
      localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuarioLogado = JSON.parse(usuarioSalvo);

      if (usuarioLogado.tipo === "GESTOR") {
        navigate("/gestor");
        return;
      }

      setUsuarioId(usuarioLogado.id);

      setForm((anterior) => ({
        ...anterior,
        nomeCompleto: usuarioLogado.nomeCompleto || "",
        email: usuarioLogado.email || "",
      }));

      carregarUsuario(usuarioLogado);
    } catch (erro) {
      console.error("Erro ao recuperar usuário:", erro);

      sessionStorage.removeItem("usuarioLogado");
      localStorage.removeItem("usuarioLogado");

      navigate("/login");
    }
  }, [navigate]);

  const carregarUsuario = async (usuarioLogado) => {
    try {
      setCarregando(true);

      const response = await fetch(
        `${API_URL}/api/usuarios/${usuarioLogado.id}`
      );

      if (!response.ok) {
        setForm((anterior) => ({
          ...anterior,
          nomeCompleto: usuarioLogado.nomeCompleto || "",
          email: usuarioLogado.email || "",
        }));

        return;
      }

      const dados = await response.json();

      setForm({
        nomeCompleto: dados.nomeCompleto || "",
        cpf: dados.cpf || "",
        telefone: dados.telefone || "",
        email: dados.email || "",
        cep: dados.cep || "",
        numero: dados.numero || "",
        rua: dados.rua || "",
        bairro: dados.bairro || "",
        cidade: dados.cidade || "",
        estado: dados.estado || "",
      });
    } catch (erro) {
      console.error(
        "Erro ao carregar dados do usuário:",
        erro
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleCepChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length > 8) {
      valor = valor.slice(0, 8);
    }

    if (valor.length > 5) {
      valor = valor.replace(
        /^(\d{5})(\d)/,
        "$1-$2"
      );
    }

    setForm((anterior) => ({
      ...anterior,
      cep: valor,
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));

    setErroCep("");
  };

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setErroCep("Digite um CEP válido com 8 números.");
      return;
    }

    try {
      setBuscandoCep(true);
      setErroCep("");

      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar CEP.");
      }

      const dados = await response.json();

      if (dados.erro) {
        setErroCep("CEP não encontrado.");

        setForm((anterior) => ({
          ...anterior,
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));

        return;
      }

      setForm((anterior) => ({
        ...anterior,
        cep: cepDigitado,
        rua: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch (erro) {
      console.error("Erro ao consultar ViaCEP:", erro);

      setErroCep("Não foi possível consultar o CEP.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      alert("Usuário não identificado.");
      return;
    }

    const cepLimpo = form.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8 || erroCep) {
      alert("Informe um CEP válido.");
      return;
    }

    if (
      !form.rua.trim() ||
      !form.bairro.trim() ||
      !form.cidade.trim() ||
      !form.estado.trim()
    ) {
      alert("Consulte um CEP válido.");
      return;
    }

    const dados = {
      nomeCompleto: form.nomeCompleto,
      telefone: form.telefone,
      email: form.email,
      cep: form.cep,
      numero: form.numero,
      rua: form.rua,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado.toUpperCase(),
    };

    try {
      setSalvando(true);

      const response = await fetch(
        `${API_URL}/api/usuarios/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
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
            "Não foi possível atualizar o perfil."
        );
      }

      const usuarioSalvo =
        sessionStorage.getItem("usuarioLogado") ||
        localStorage.getItem("usuarioLogado");

      if (usuarioSalvo) {
        const usuarioAtual =
          JSON.parse(usuarioSalvo);

        const usuarioAtualizado = {
          ...usuarioAtual,
          nomeCompleto: form.nomeCompleto,
          email: form.email,
        };

        if (
          sessionStorage.getItem("usuarioLogado")
        ) {
          sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioAtualizado)
          );
        } else {
          localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioAtualizado)
          );
        }
      }

      window.dispatchEvent(
        new Event("usuarioLogadoAtualizado")
      );

      alert("Perfil atualizado com sucesso!");

      navigate("/perfil");
    } catch (erro) {
      console.error(
        "Erro ao atualizar perfil:",
        erro
      );

      alert(
        erro.message ||
          "Não foi possível atualizar o perfil."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <main className="editar-perfil-page">
        <div className="editar-perfil-container">
          <p>Carregando perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="editar-perfil-page">
      <div className="editar-perfil-container">

        <div className="editar-perfil-topo">
          <span className="editar-perfil-label">
            Minha conta
          </span>

          <h1>Editar perfil</h1>

          <p>
            Atualize suas informações pessoais e dados de
            contato.
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
                <label htmlFor="nomeCompleto">
                  Nome completo
                </label>

                <input
                  type="text"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  value={form.nomeCompleto}
                  onChange={handleChange}
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
                  name="cpf"
                  value={form.cpf}
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
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="cep"
                  placeholder="00000-000"
                  value={form.cep}
                  maxLength={9}
                  onChange={handleCepChange}
                  onBlur={(e) =>
                    buscarCep(e.target.value)
                  }
                  required
                />

                {buscandoCep && (
                  <small>
                    Buscando CEP...
                  </small>
                )}

                {erroCep && (
                  <small className="cadastro-error">
                    {erroCep}
                  </small>
                )}
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="numero">
                  Número
                </label>

                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número"
                  value={form.numero}
                  onChange={handleChange}
                />
              </div>

              <div className="editar-perfil-field campo-largo">
                <label htmlFor="rua">
                  Rua / Avenida
                </label>

                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={form.rua}
                  readOnly
                  required
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="bairro">
                  Bairro
                </label>

                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={form.bairro}
                  readOnly
                  required
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="cidade">
                  Cidade
                </label>

                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={form.cidade}
                  readOnly
                  required
                />
              </div>

              <div className="editar-perfil-field">
                <label htmlFor="estado">
                  Estado
                </label>

                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={form.estado}
                  readOnly
                  required
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
              disabled={salvando || buscandoCep}
            >
              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>

          </div>
        </form>

      </div>
    </main>
  );
}

export default EditarPerfil;