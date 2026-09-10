import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

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

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/solicitar-plantio"
              element={<SolicitarPlantio />}
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
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/editar" element={<EditarPerfil />} />
            <Route path="/gestor" element={<Gestor />} />
            <Route path="/gestor/solicitacao/:protocolo"
                  element={<DetalhesSolicitacao />} />
            <Route
                    path="/recuperar-senha"
                    element={<RecuperarSenha />}
                  />                      
          </Routes>
        </main>

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;