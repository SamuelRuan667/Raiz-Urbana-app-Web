import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../services/api";

import "./Recompensas.css";

function Recompensas() {
  const navigate = useNavigate();

  const [recompensas, setRecompensas] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [resgates, setResgates] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [resgatandoId, setResgatandoId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [ultimoCodigo, setUltimoCodigo] = useState("");

  useEffect(() => {
    async function carregarPagina() {
      const usuarioSalvo =
        sessionStorage.getItem("usuarioLogado") ||
        localStorage.getItem("usuarioLogado");

      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!usuarioSalvo || !token) {
        navigate("/login");
        return;
      }

      try {
        const usuarioLogado = JSON.parse(usuarioSalvo);

        if (usuarioLogado.tipo !== "USUARIO") {
          navigate("/");
          return;
        }

        setCarregando(true);

        await Promise.all([
          carregarCarteira(token),
          carregarRecompensas(token),
          carregarResgates(token),
        ]);
      } catch (erro) {
        console.error(
          "Erro ao carregar página de recompensas:",
          erro
        );

        setMensagem(
          "Não foi possível carregar o sistema de recompensas."
        );
        setTipoMensagem("erro");
      } finally {
        setCarregando(false);
      }
    }

    carregarPagina();
  }, [navigate]);

  const carregarCarteira = async (token) => {
    try {
      const resposta = await fetch(
        `${API_URL}/api/carteiras-capiba/minha`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resposta.ok) {
        setSaldo(0);
        return;
      }

      const dados = await resposta.json();

      setSaldo(dados.saldo ?? 0);
    } catch (erro) {
      console.error(
        "Erro ao carregar Carteira Capiba:",
        erro
      );

      setSaldo(0);
    }
  };

  const carregarRecompensas = async (token) => {
    try {
      const resposta = await fetch(
        `${API_URL}/api/recompensas`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resposta.ok) {
        setRecompensas([]);
        return;
      }

      const dados = await resposta.json();

      setRecompensas(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (erro) {
      console.error(
        "Erro ao carregar recompensas:",
        erro
      );

      setRecompensas([]);
    }
  };

  const carregarResgates = async (token) => {
    try {
      const resposta = await fetch(
        `${API_URL}/api/recompensas/meus-resgates`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resposta.ok) {
        setResgates([]);
        return;
      }

      const dados = await resposta.json();

      setResgates(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (erro) {
      console.error(
        "Erro ao carregar resgates:",
        erro
      );

      setResgates([]);
    }
  };

  const resgatarRecompensa = async (recompensa) => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (saldo < recompensa.custoMoedas) {
      setMensagem(
        "Você não possui Moedas Capiba suficientes para esta recompensa."
      );
      setTipoMensagem("erro");
      setUltimoCodigo("");
      return;
    }

    try {
      setResgatandoId(recompensa.id);
      setMensagem("");
      setTipoMensagem("");
      setUltimoCodigo("");

      const resposta = await fetch(
        `${API_URL}/api/recompensas/${recompensa.id}/resgatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resposta.ok) {
        let mensagemErro =
          "Não foi possível realizar o resgate.";

        try {
          const dadosErro =
            await resposta.json();

          mensagemErro =
            dadosErro.message ||
            dadosErro.mensagem ||
            dadosErro.erro ||
            mensagemErro;
        } catch {
          try {
            const textoErro =
              await resposta.text();

            if (textoErro) {
              mensagemErro = textoErro;
            }
          } catch {
            mensagemErro =
              "Não foi possível realizar o resgate.";
          }
        }

        setMensagem(mensagemErro);
        setTipoMensagem("erro");
        return;
      }

      const resgate =
        await resposta.json();

      setMensagem(
        `Recompensa "${recompensa.titulo}" resgatada com sucesso!`
      );
      setTipoMensagem("sucesso");
      setUltimoCodigo(
        resgate.codigoResgate || ""
      );

      await Promise.all([
        carregarCarteira(token),
        carregarRecompensas(token),
        carregarResgates(token),
      ]);
    } catch (erro) {
      console.error(
        "Erro ao resgatar recompensa:",
        erro
      );

      setMensagem(
        "Não foi possível realizar o resgate."
      );
      setTipoMensagem("erro");
    } finally {
      setResgatandoId(null);
    }
  };

  const formatarValidade = (recompensa) => {
    if (
      !recompensa.validadeInicio &&
      !recompensa.validadeFim
    ) {
      return "Sem prazo de validade definido";
    }

    if (
      recompensa.validadeInicio &&
      recompensa.validadeFim
    ) {
      return `Válido de ${formatarData(
        recompensa.validadeInicio
      )} até ${formatarData(
        recompensa.validadeFim
      )}`;
    }

    if (recompensa.validadeFim) {
      return `Válido até ${formatarData(
        recompensa.validadeFim
      )}`;
    }

    return `Disponível a partir de ${formatarData(
      recompensa.validadeInicio
    )}`;
  };

  const formatarData = (data) => {
    if (!data) {
      return "-";
    }

    const partes = data.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  };

  const formatarDataHora = (data) => {
    if (!data) {
      return "-";
    }

    return new Date(data).toLocaleString(
      "pt-BR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  if (carregando) {
    return (
      <main className="recompensas-page">
        <section className="recompensas-card">
          <p>
            Carregando recompensas...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="recompensas-page">
      <section className="recompensas-header">
        <div className="trofeu-icon">
          🏆
        </div>

        <div>
          <h1>
            Sistema de Recompensas Capiba Verde
          </h1>

          <p>
            Contribua com a arborização da cidade,
            acumule Moedas Capiba e troque suas moedas
            por recompensas disponíveis no programa.
          </p>
        </div>
      </section>

      <section className="recompensas-card">
        <h2>Programa Capiba Verde</h2>

        <div className="sistema-recompensas">
          <div className="sistema-header">
            <div className="sistema-titulo">
              <span className="folha-icon">
                🌿
              </span>

              <h3>
                Sistema de Recompensas
              </h3>
            </div>

            <div className="saldo-badge">
              <span>★</span>{" "}
              {saldo} Moedas Capiba
            </div>
          </div>

          <p>
            Troque suas Moedas Capiba por recompensas
            disponíveis. Seu saldo é atualizado
            automaticamente após cada resgate.
          </p>
        </div>

        {mensagem && (
          <div
            className={`recompensas-mensagem ${tipoMensagem}`}
          >
            <strong>
              {mensagem}
            </strong>

            {ultimoCodigo && (
              <div className="codigo-resgate">
                <span>
                  Código do resgate
                </span>

                <strong>
                  {ultimoCodigo}
                </strong>
              </div>
            )}
          </div>
        )}

        <div className="recompensas-disponiveis">
          <h3>
            Recompensas Disponíveis
          </h3>

          {recompensas.length === 0 ? (
            <div className="recompensas-vazio">
              <p>
                Nenhuma recompensa disponível no momento.
              </p>
            </div>
          ) : (
            <div className="recompensas-grid">
              {recompensas.map((recompensa) => {
                const saldoInsuficiente =
                  saldo < recompensa.custoMoedas;

                const resgatando =
                  resgatandoId === recompensa.id;

                return (
                  <div
                    className="recompensa-item"
                    key={recompensa.id}
                  >
                    <div className="recompensa-icon">
                      %
                    </div>

                    <h4>
                      {recompensa.titulo}
                    </h4>

                    {recompensa.descricao && (
                      <p className="recompensa-descricao">
                        {recompensa.descricao}
                      </p>
                    )}

                    <p className="validade">
                      {formatarValidade(
                        recompensa
                      )}
                    </p>

                    {recompensa.quantidadeDisponivel !==
                      null &&
                      recompensa.quantidadeDisponivel !==
                        undefined && (
                        <p className="recompensa-estoque">
                          {recompensa.quantidadeDisponivel}{" "}
                          unidade(s) disponível(is)
                        </p>
                      )}

                    <div className="recompensa-footer">
                      <span className="custo">
                        <span>★</span>{" "}
                        {recompensa.custoMoedas} moedas
                      </span>

                      <button
                        type="button"
                        disabled={
                          saldoInsuficiente ||
                          resgatando
                        }
                        className={
                          saldoInsuficiente ||
                          resgatando
                            ? "resgatar-button disabled"
                            : "resgatar-button"
                        }
                        onClick={() =>
                          resgatarRecompensa(
                            recompensa
                          )
                        }
                      >
                        {resgatando
                          ? "Resgatando..."
                          : saldoInsuficiente
                          ? "Saldo insuficiente"
                          : "Resgatar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <section className="ganhar-moedas">
          <h3>
            Como ganhar Moedas Capiba?
          </h3>

          <div className="ganhar-lista">
            <div className="ganhar-item">
              <span className="ganhar-icon">
                🌳
              </span>

              <div>
                <strong>
                  Tenha um plantio concluído
                </strong>

                <p>
                  Você recebe 20 Moedas Capiba
                  quando sua solicitação de plantio
                  é concluída.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="meus-resgates">
          <h3>
            Meus Resgates
          </h3>

          {resgates.length === 0 ? (
            <p className="resgates-vazio">
              Você ainda não realizou nenhum resgate.
            </p>
          ) : (
            <div className="resgates-lista">
              {resgates.map((resgate) => (
                <div
                  className="resgate-item"
                  key={resgate.id}
                >
                  <div className="resgate-info">
                    <strong>
                      {resgate.tituloRecompensa}
                    </strong>

                    <span>
                      {formatarDataHora(
                        resgate.dataResgate
                      )}
                    </span>

                    <span>
                      {resgate.moedasGastas} Moedas
                      Capiba utilizadas
                    </span>
                  </div>

                  <div className="resgate-codigo">
                    <span>
                      Código
                    </span>

                    <strong>
                      {resgate.codigoResgate}
                    </strong>

                    <small>
                      {resgate.status}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="recompensas-cta">
          <p>
            Quer começar a acumular Moedas Capiba?
          </p>

          <Link
            to="/solicitar-plantio"
            className="recompensas-cta-button"
          >
            Solicitar Plantio
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Recompensas;