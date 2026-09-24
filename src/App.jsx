import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SolicitarPlantio from "./pages/SolicitarPlantio";
import ConsultarStatus from "./pages/ConsultarStatus";
import Recompensas from "./pages/Recompensas";
import QuemSomos from "./pages/QuemSomos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Gestor from "./pages/Gestor";
import DetalhesSolicitacao from "./pages/DetalhesSolicitacao";
import RecuperarSenha from "./pages/RecuperarSenha";
import Parcerias from "./pages/Parcerias";
import PropostaParceria from "./pages/PropostaParceria";
import ConfirmacaoProposta from "./pages/ConfirmacaoProposta";

import Admin from "./pages/boss/Admin";
import AdminPropostas from "./pages/boss/AdminPropostas";
import AdminPropostaDetalhes from "./pages/boss/AdminPropostaDetalhes";
import AdminSolicitacoes from "./pages/boss/AdminSolicitacoes";
import AdminSolicitacaoDetalhes from "./pages/boss/AdminSolicitacaoDetalhes";
import AdminUsuarios from "./pages/boss/AdminUsuarios";
import AdminUsuarioDetalhes from "./pages/boss/AdminUsuarioDetalhes";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/consultar-status"
              element={<ConsultarStatus />}
            />

            <Route
              path="/recompensas"
              element={<Recompensas />}
            />

            <Route
              path="/quem-somos"
              element={<QuemSomos />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/cadastro"
              element={<Cadastro />}
            />

            <Route
              path="/recuperar-senha"
              element={<RecuperarSenha />}
            />

            <Route
              path="/parcerias"
              element={<Parcerias />}
            />

            <Route
              path="/parcerias/proposta"
              element={<PropostaParceria />}
            />

            <Route
              path="/parcerias/proposta/enviada"
              element={<ConfirmacaoProposta />}
            />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute
                  tiposPermitidos={["USUARIO"]}
                >
                  <Perfil />
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil/editar"
              element={
                <ProtectedRoute
                  tiposPermitidos={["USUARIO"]}
                >
                  <EditarPerfil />
                </ProtectedRoute>
              }
            />

            <Route
              path="/solicitar-plantio"
              element={
                <ProtectedRoute
                  tiposPermitidos={["USUARIO"]}
                >
                  <SolicitarPlantio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gestor"
              element={
                <ProtectedRoute
                  tiposPermitidos={[
                    "GESTOR",
                    "BOSS",
                  ]}
                >
                  <Gestor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gestor/solicitacao/:id"
              element={
                <ProtectedRoute
                  tiposPermitidos={[
                    "GESTOR",
                    "BOSS",
                  ]}
                >
                  <DetalhesSolicitacao />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/propostas"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminPropostas />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/propostas/:id"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminPropostaDetalhes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/solicitacoes"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminSolicitacoes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/solicitacoes/:id"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminSolicitacaoDetalhes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios/:id"
              element={
                <ProtectedRoute
                  tiposPermitidos={["BOSS"]}
                >
                  <AdminUsuarioDetalhes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;