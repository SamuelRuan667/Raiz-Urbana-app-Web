
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({
  children,
  tiposPermitidos = [],
}) {
  const location = useLocation();

  const usuarioSession =
    sessionStorage.getItem("usuarioLogado");

  const tokenSession =
    sessionStorage.getItem("token");

  const usuarioLocal =
    localStorage.getItem("usuarioLogado");

  const tokenLocal =
    localStorage.getItem("token");

  let usuarioSalvo = null;
  let token = null;

  if (usuarioSession && tokenSession) {
    usuarioSalvo = usuarioSession;
    token = tokenSession;
  } else if (usuarioLocal && tokenLocal) {
    usuarioSalvo = usuarioLocal;
    token = tokenLocal;
  }

  if (!usuarioSalvo || !token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  let usuario;

  try {
    usuario = JSON.parse(usuarioSalvo);
  } catch {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (!usuario?.id || !usuario?.tipo) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (
    tiposPermitidos.length > 0 &&
    !tiposPermitidos.includes(usuario.tipo)
  ) {
    if (usuario.tipo === "BOSS") {
      return <Navigate to="/admin" replace />;
    }

    if (usuario.tipo === "GESTOR") {
      return <Navigate to="/gestor" replace />;
    }

    if (usuario.tipo === "EMPRESA_PARCEIRA") {
      return <Navigate to="/parcerias" replace />;
    }

    if (usuario.tipo === "USUARIO") {
      return <Navigate to="/perfil" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;