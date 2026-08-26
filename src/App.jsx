import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SolicitarPlantio from "./pages/SolicitarPlantio";
import ConsultarStatus from "./pages/ConsultarStatus";
import Recompensas from "./pages/Recompensas";
import QuemSomos from "./pages/QuemSomos";
import Login from "./pages/Login";

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
          </Routes>
        </main>

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;