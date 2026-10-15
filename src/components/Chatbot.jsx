
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { classificarMensagem } from "../chatbot/classificador";
import "./Chatbot.css";

const perguntas = [
  {
    id: "plantio",
    titulo: "Como solicitar um plantio?",
    resposta:
      "Para solicitar o plantio de uma árvore, acesse Solicitar Plantio e preencha o formulário com os dados e uma foto do local. É necessário estar conectado à sua conta.",
    link: "/solicitar-plantio",
    textoLink: "Solicitar Plantio",
  },
  {
    id: "status",
    titulo: "Como consultar minha solicitação?",
    resposta:
      "Você pode acompanhar o andamento do seu pedido pela página Consultar Status, utilizando o protocolo da solicitação.",
    link: "/consultar-status",
    textoLink: "Consultar Status",
  },
  {
    id: "recompensas",
    titulo: "Como funcionam as recompensas?",
    resposta:
      "O Raiz Urbana possui um sistema de Moedas Capiba. A regra prevista é conceder 20 moedas quando a solicitação for aprovada e mais 20 quando for concluída. Confira as recompensas disponíveis na página correspondente.",
    link: "/recompensas",
    textoLink: "Ver Recompensas",
  },
  {
    id: "arborizacao",
    titulo: "Quais os benefícios das árvores?",
    resposta:
      "As árvores ajudam a reduzir o calor urbano, oferecem sombra, contribuem para a qualidade do ar e favorecem a biodiversidade. O Raiz Urbana incentiva a arborização responsável em Recife.",
    link: "/quem-somos",
    textoLink: "Conhecer o Projeto",
  },
  {
    id: "conta",
    titulo: "Preciso criar uma conta?",
    resposta:
      "Para solicitar um plantio, você precisa de uma conta de usuário. Se ainda não possui uma, acesse a página de cadastro.",
    link: "/cadastro",
    textoLink: "Criar Conta",
  },
];

const boasVindas = {
  id: "boas-vindas",
  autor: "bot",
  texto:
    "Olá! Seja bem-vindo ao Raiz Urbana! 🌱 Sou o assistente virtual do projeto. Como posso ajudar você hoje?",
};

function LogoCapivara({ pequena = false }) {
  return (
    <div
      className={`chatbot-logo-capivara ${
        pequena ? "chatbot-logo-pequena" : ""
      }`}
      aria-hidden="true"
    >
      <div className="logo-icon">
        <div className="logo-face">
          <span></span>
          <span></span>
          <div className="logo-mouth"></div>
        </div>
      </div>
    </div>
  );
}

function Chatbot() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([boasVindas]);

  const fimRef = useRef(null);
  const campoRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (aberto) {
      fimRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [historico, aberto]);

  useEffect(() => {
    if (aberto) {
      campoRef.current?.focus();
    }
  }, [aberto]);

  useEffect(() => {
    setAberto(false);
  }, [location.pathname]);

  function responder(texto, intencaoDireta = null) {
    const resultado = intencaoDireta
      ? {
          intencao: intencaoDireta,
          confianca: 1,
        }
      : classificarMensagem(texto);

    const pergunta = perguntas.find(
      (item) => item.id === resultado.intencao
    );

    const novaMensagem = {
      id: crypto.randomUUID(),
      autor: "usuario",
      texto,
    };

    const resposta = {
      id: crypto.randomUUID(),
      autor: "bot",
      texto: pergunta
        ? pergunta.resposta
        : "Desculpe, ainda não consegui compreender sua pergunta. Posso ajudar com solicitações de plantio, consulta de status, recompensas, cadastro e arborização.",
      link: pergunta?.link,
      textoLink: pergunta?.textoLink,
    };

    setHistorico((anterior) => [
      ...anterior,
      novaMensagem,
      resposta,
    ]);
  }

  function enviarMensagem(evento) {
    evento.preventDefault();

    const texto = mensagem.trim();

    if (!texto) return;

    responder(texto);
    setMensagem("");
  }

  function reiniciarConversa() {
    setHistorico([boasVindas]);
    setMensagem("");
  }

  return (
    <div className="chatbot-container">
      {aberto && (
        <section
          className="chatbot-janela"
          role="dialog"
          aria-label="Assistente virtual Raiz Urbana"
        >
          <div className="chatbot-cabecalho">
            <div className="chatbot-identidade">
              <div className="chatbot-avatar">
                <LogoCapivara pequena />
              </div>

              <div>
                <strong>Assistente Raiz Urbana</strong>
                <span>Atendimento virtual com IA</span>
              </div>
            </div>

            <div className="chatbot-acoes">
              <button
                type="button"
                onClick={reiniciarConversa}
                aria-label="Reiniciar conversa"
                title="Reiniciar conversa"
              >
                ↻
              </button>

              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar chatbot"
                title="Fechar"
              >
                ×
              </button>
            </div>
          </div>

          <div
            className="chatbot-mensagens"
            aria-live="polite"
          >
            {historico.map((item) => (
              <div
                key={item.id}
                className={`chatbot-mensagem ${item.autor}`}
              >
                <div className="chatbot-balao">
                  <p>{item.texto}</p>

                  {item.link && (
                    <Link
                      className="chatbot-link"
                      to={item.link}
                      onClick={() => setAberto(false)}
                    >
                      {item.textoLink} →
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <div ref={fimRef} />
          </div>

          <div className="chatbot-sugestoes">
            {perguntas.slice(0, 3).map((pergunta) => (
              <button
                key={pergunta.id}
                type="button"
                onClick={() =>
                  responder(pergunta.titulo, pergunta.id)
                }
              >
                {pergunta.titulo}
              </button>
            ))}
          </div>

          <form
            className="chatbot-formulario"
            onSubmit={enviarMensagem}
          >
            <input
              ref={campoRef}
              type="text"
              value={mensagem}
              onChange={(evento) =>
                setMensagem(evento.target.value)
              }
              placeholder="Digite sua pergunta..."
              aria-label="Digite sua pergunta"
              maxLength={500}
            />

            <button
              type="submit"
              disabled={!mensagem.trim()}
              aria-label="Enviar mensagem"
            >
              ➤
            </button>
          </form>

          <div className="chatbot-rodape">
            Assistente Virtual • Raiz Urbana
          </div>
        </section>
      )}

      <button
        type="button"
        className="chatbot-botao-flutuante"
        onClick={() => setAberto((anterior) => !anterior)}
        aria-label={
          aberto ? "Fechar chatbot" : "Abrir chatbot"
        }
        aria-expanded={aberto}
        title="Assistente Raiz Urbana"
      >
        {aberto ? (
          <span className="chatbot-fechar-flutuante">
            ×
          </span>
        ) : (
          <LogoCapivara />
        )}
      </button>
    </div>
  );
}

export default Chatbot;