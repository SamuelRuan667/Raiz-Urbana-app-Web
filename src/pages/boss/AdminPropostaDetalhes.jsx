import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminPropostaDetalhes.css";

function AdminPropostaDetalhes() {
  const { id } = useParams();

  const [status, setStatus] = useState("PENDENTE");
  const [processando, setProcessando] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [mostrarRecusa, setMostrarRecusa] = useState(false);

  const proposta = {
    id,
    razaoSocial: "Empresa Exemplo LTDA",
    nomeFantasia: "Empresa Exemplo",
    cnpj: "00.000.000/0001-00",
    responsavel: "Responsável Exemplo",
    email: "empresa@exemplo.com",
    telefone: "(81) 99999-9999",
    cep: "50030-230",
    rua: "Rua do Exemplo",
    numero: "100",
    bairro: "Recife Antigo",
    cidade: "Recife",
    estado: "PE",
    tipoParceria: "Apoio a ações ambientais",
    descricao:
      "Nossa empresa deseja apoiar ações ambientais realizadas pelo Raiz Urbana e contribuir com iniciativas de arborização na cidade.",
    dataEnvio: "24/09/2026",
  };

  const aprovarProposta = () => {
    const confirmar = window.confirm(
      `Deseja aprovar a proposta da empresa ${proposta.nomeFantasia}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setProcessando(true);

      setStatus("APROVADA");
      setMostrarRecusa(false);
      setMotivoRecusa("");

      alert("Proposta aprovada com sucesso!");
    } finally {
      setProcessando(false);
    }
  };

  const abrirRecusa = () => {
    setMostrarRecusa(true);
  };

  const cancelarRecusa = () => {
    setMostrarRecusa(false);
    setMotivoRecusa("");
  };

  const recusarProposta = () => {
    if (!motivoRecusa.trim()) {
      alert("Informe o motivo da recusa.");
      return;
    }

    const confirmar = window.confirm(
      "Deseja realmente recusar esta proposta?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setProcessando(true);

      setStatus("RECUSADA");
      setMostrarRecusa(false);

      alert("Proposta recusada.");
    } finally {
      setProcessando(false);
    }
  };

  const traduzirStatus = () => {
    switch (status) {
      case "APROVADA":
        return "Aprovada";

      case "RECUSADA":
        return "Recusada";

      default:
        return "Aguardando análise";
    }
  };

  return (
    <main className="admin-detalhes-page">
      <div className="admin-detalhes-container">
        <div className="admin-detalhes-voltar">
          <Link to="/admin/propostas">
            ← Voltar para propostas
          </Link>
        </div>

        <section className="admin-detalhes-topo">
          <div>
            <span className="admin-detalhes-label">
              Proposta #{id}
            </span>

            <h1>{proposta.nomeFantasia}</h1>

            <p>
              Analise os dados da empresa e a proposta enviada
              para o Raiz Urbana.
            </p>
          </div>

          <span
            className={`admin-detalhes-status status-${status.toLowerCase()}`}
          >
            {traduzirStatus()}
          </span>
        </section>

        <section className="admin-detalhes-card">
          <h2>Dados da empresa</h2>

          <div className="admin-detalhes-grid">
            <div className="admin-detalhes-dado">
              <span>Razão Social</span>
              <strong>{proposta.razaoSocial}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Nome Fantasia</span>
              <strong>{proposta.nomeFantasia}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>CNPJ</span>
              <strong>{proposta.cnpj}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Responsável</span>
              <strong>{proposta.responsavel}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>E-mail</span>
              <strong>{proposta.email}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Telefone</span>
              <strong>{proposta.telefone}</strong>
            </div>
          </div>
        </section>

        <section className="admin-detalhes-card">
          <h2>Endereço da empresa</h2>

          <div className="admin-detalhes-grid">
            <div className="admin-detalhes-dado">
              <span>CEP</span>
              <strong>{proposta.cep}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Número</span>
              <strong>{proposta.numero || "Não informado"}</strong>
            </div>

            <div className="admin-detalhes-dado admin-detalhes-largo">
              <span>Rua / Avenida</span>
              <strong>{proposta.rua}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Bairro</span>
              <strong>{proposta.bairro}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Cidade / Estado</span>
              <strong>
                {proposta.cidade} - {proposta.estado}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-detalhes-card">
          <h2>Proposta de parceria</h2>

          <div className="admin-detalhes-proposta">
            <div className="admin-detalhes-dado">
              <span>Tipo de parceria</span>
              <strong>{proposta.tipoParceria}</strong>
            </div>

            <div className="admin-detalhes-dado">
              <span>Data de envio</span>
              <strong>{proposta.dataEnvio}</strong>
            </div>

            <div className="admin-detalhes-descricao">
              <span>Descrição da proposta</span>

              <p>{proposta.descricao}</p>
            </div>
          </div>
        </section>

        {status === "PENDENTE" && (
          <section className="admin-detalhes-card admin-analise-card">
            <h2>Análise da proposta</h2>

            <p className="admin-analise-descricao">
              Após conferir todas as informações, escolha se a
              empresa será aprovada como parceira do Raiz Urbana.
            </p>

            {!mostrarRecusa && (
              <div className="admin-analise-acoes">
                <button
                  type="button"
                  className="admin-recusar"
                  onClick={abrirRecusa}
                  disabled={processando}
                >
                  Recusar proposta
                </button>

                <button
                  type="button"
                  className="admin-aprovar"
                  onClick={aprovarProposta}
                  disabled={processando}
                >
                  Aprovar proposta
                </button>
              </div>
            )}

            {mostrarRecusa && (
              <div className="admin-recusa-container">
                <label htmlFor="motivoRecusa">
                  Motivo da recusa
                </label>

                <textarea
                  id="motivoRecusa"
                  value={motivoRecusa}
                  onChange={(e) =>
                    setMotivoRecusa(e.target.value)
                  }
                  placeholder="Explique o motivo da recusa da proposta..."
                  rows={5}
                />

                <div className="admin-recusa-acoes">
                  <button
                    type="button"
                    className="admin-cancelar-recusa"
                    onClick={cancelarRecusa}
                    disabled={processando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="admin-confirmar-recusa"
                    onClick={recusarProposta}
                    disabled={processando}
                  >
                    Confirmar recusa
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {status === "APROVADA" && (
          <div className="admin-resultado admin-resultado-aprovado">
            <div>✓</div>

            <section>
              <strong>Empresa aprovada</strong>

              <p>
                Esta empresa foi aprovada para participar do
                programa de parceiros do Raiz Urbana.
              </p>
            </section>
          </div>
        )}

        {status === "RECUSADA" && (
          <div className="admin-resultado admin-resultado-recusado">
            <div>×</div>

            <section>
              <strong>Proposta recusada</strong>

              <p>
                Esta proposta foi recusada pela administração.
              </p>

              {motivoRecusa && (
                <p>
                  <b>Motivo:</b> {motivoRecusa}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPropostaDetalhes;