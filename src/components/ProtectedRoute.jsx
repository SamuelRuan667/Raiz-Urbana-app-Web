import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  tiposPermitidos = [],
}) {
  const usuarioSalvo =
    sessionStorage.getItem("usuarioLogado") ||
    localStorage.getItem("usuarioLogado");

  if (!usuarioSalvo) {
    return <Navigate to="/login" replace />;
  }

  try {
    const usuario = JSON.parse(usuarioSalvo);

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

      return <Navigate to="/perfil" replace />;
    }

    return children;
  } catch {
    sessionStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioLogado");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;