import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Menu from './pages/Menu';
import Asignacion from "./pages/gestion-colaboradores/Asignacion"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
/* Imports de paginas de colaboradores */
import GestionColaboradores from "./pages/gestion-colaboradores/GestionColaboradores"
import RegistrarColaborador from "./pages/gestion-colaboradores/RegistrarColaborador";
import ModificarColaborador from "./pages/gestion-colaboradores/ModificarColaborador"
import ReporteColaboradores from "./pages/gestion-colaboradores/ReporteColaboradores"

/* Imports de paginas de proyectos */
import GestionProyectos from "./pages/gestion-proyectos/GestionProyectos";
import CrearProyecto from "./pages/gestion-proyectos/CrearProyecto";
import ConsultarProyectos from './pages/gestion-proyectos/ConsultarProyectos';
import ModificarProyecto from './pages/gestion-proyectos/ModificarProyecto';
import Reuniones from './pages/gestion-proyectos/Reuniones';
import Informes from './pages/gestion-proyectos/Informes';

/* Import de evaluaciones*/
import InformeGeneral from './pages/Evaluaciones/InformeGeneral';
import BurndownChart from './pages/Evaluaciones/BurndownChart';
import Foros from './pages/Evaluaciones/Foros';
import Evaluaciones from './pages/Evaluaciones/GestionEvaluaciones';
import ConsultarForo from './pages/Evaluaciones/ConsultarForo';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registerCuenta" element={<RegisterPage />} />
          <Route path="/menu" element={<Menu />} />

          {/* Rutas de Colaboradores */}
          <Route path="/gestionColaboradores" element={<GestionColaboradores />} />
          <Route path="/registrarColaborador" element={<RegistrarColaborador />} />
          <Route path="/modificarColaborador" element={<ModificarColaborador />} />
          <Route path="/asignacion" element={<Asignacion />} />
          <Route path="/reporteColaboradores" element={<ReporteColaboradores />} />

          {/* Rutas de Proyectos */}
          <Route path="/gestionProyectos" element={<GestionProyectos />} />
          <Route path="/crearProyecto" element={<CrearProyecto />} />
          <Route path="/consultarProyecto" element={<ConsultarProyectos />} />
          <Route path="/modificarProyecto" element={<ModificarProyecto />} />
          <Route path="/reuniones" element={<Reuniones />} />
          <Route path="/informes" element={<Informes />} />

          {/* Rutas de Evaluaciones */}
          <Route path='/evaluaciones' element={<Evaluaciones />} />
          <Route path="/informeGeneral" element={<InformeGeneral />} />
          <Route path="/burndownChart" element={<BurndownChart />} />
          <Route path='/crearForo' element={<Foros />} />
          <Route path='/consultarForo' element={<ConsultarForo />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
