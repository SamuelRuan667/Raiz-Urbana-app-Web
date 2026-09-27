import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  tiposPermitidos = [],
}) {
  // Procura primeiro na sessão.
  const usuarioSession =
    sessionStorage.getItem("usuarioLogado");

  const tokenSession =
    sessionStorage.getItem("token");

  // Depois procura no armazenamento persistente.
  const usuarioLocal =
    localStorage.getItem("usuarioLogado");

  const tokenLocal =
    localStorage.getItem("token");

  // Usuário e token precisam vir do mesmo armazenamento.
  let usuarioSalvo = null;
  let token = null;

  if (usuarioSession && tokenSession) {
    usuarioSalvo = usuarioSession;
    token = tokenSession;
  } else if (usuarioLocal && tokenLocal) {
    usuarioSalvo = usuarioLocal;
    token = tokenLocal;
  }

  // Se não houver usuário ou token,
  // não existe autenticação válida no frontend.
  if (!usuarioSalvo || !token) {
    sessionStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("token");

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  try {
    const usuario =
      JSON.parse(usuarioSalvo);

    // Verificação básica dos dados necessários.
    if (
      !usuario.id ||
      !usuario.tipo
    ) {
      throw new Error(
        "Dados do usuário inválidos."
      );
    }

    // Se a rota possuir restrição de perfil,
    // verifica se o usuário pode acessá-la.
    if (
      tiposPermitidos.length > 0 &&
      !tiposPermitidos.includes(usuario.tipo)
    ) {
      // BOSS volta para sua área.
      if (usuario.tipo === "BOSS") {
        return (
          <Navigate
            to="/admin"
            replace
          />
        );
      }

      // GESTOR volta para sua área.
      if (usuario.tipo === "GESTOR") {
        return (
          <Navigate
            to="/gestor"
            replace
          />
        );
      }

      // USUARIO comum volta para o perfil.
      return (
        <Navigate
          to="/perfil"
          replace
        />
      );
    }

    // Usuário autenticado e autorizado.
    return children;
  } catch (error) {
    console.error(
      "Erro ao validar usuário autenticado:",
      error
    );

    // Remove dados inválidos.
    sessionStorage.removeItem(
      "usuarioLogado"
    );

    sessionStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuarioLogado"
    );

    localStorage.removeItem(
      "token"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
}

export default ProtectedRoute;