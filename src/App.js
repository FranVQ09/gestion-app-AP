import './App.css';
import LoginPage from './pages/LoginPage';
import Menu from './pages/Menu';
import Asignacion from "./pages/gestion-colaboradores/Asignacion"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
/* Imports de paginas de colaboradores */
import GestionColaboradores from "./pages/gestion-colaboradores/GestionColaboradores"
import RegistrarColaborador from "./pages/gestion-colaboradores/RegistrarColaborador";
import ModificarColaborador from "./pages/gestion-colaboradores/ModificarColaborador"

/* Imports de paginas de proyectos */
import GestionProyectos from "./pages/gestion-proyectos/GestionProyectos";
import CrearProyecto from "./pages/gestion-proyectos/CrearProyecto";
import ConsultarProyectos from './pages/gestion-proyectos/ConsultarProyectos';
import ModificarProyecto from './pages/gestion-proyectos/ModificarProyecto';
import Reuniones from './pages/gestion-proyectos/Reuniones';

/* Import de evaluaciones*/
import InformeGeneral from './pages/Evaluaciones/InformeGeneral';
import BurndownChart from './pages/Evaluaciones/BurndownChart';
import Foros from './pages/Evaluaciones/Foros';
import Evaluaciones from './pages/Evaluaciones/GestionEvaluaciones';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/menu" element={<Menu />} />

          {/* Rutas de Colaboradores */}
          <Route path="/gestionColaboradores" element={<GestionColaboradores />} />
          <Route path="/registrarColaborador" element={<RegistrarColaborador />} />
          <Route path="/modificarColaborador" element={<ModificarColaborador />} />
          <Route path="/asignacion" element={<Asignacion />} />

          {/* Rutas de Proyectos */}
          <Route path="/gestionProyectos" element={<GestionProyectos />} />
          <Route path="/crearProyecto" element={<CrearProyecto />} />
          <Route path="/consultarProyecto" element={<ConsultarProyectos />} />
          <Route path="/modificarProyecto" element={<ModificarProyecto />} />
          <Route path="/reuniones" element={<Reuniones />} />

          {/* Rutas de Evaluaciones */}
          <Route path='/evaluaciones' element={<Evaluaciones />} />
          <Route path="/informeGeneral" element={<InformeGeneral />} />
          <Route path="/burndownChart" element={<BurndownChart />} />
          <Route path='/foros' element={<Foros />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
