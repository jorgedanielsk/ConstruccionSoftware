import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GymProvider } from './context/GymContext';
import Login from './views/Login';
import DashboardRecepcion from './views/DashboardRecepcion';
import RegistrarSocio from './views/RegistrarSocio';
import CobrosRenovaciones from './views/CobrosRenovaciones';
import GestionMembresias from './views/GestionMembresias';
import Navbar from './components/Navbar';

function App() {
  return (
    <GymProvider>
      <Router>
        <Navbar /> 
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recepcion" element={<DashboardRecepcion />} />
          <Route path="/registrar-socio" element={<RegistrarSocio />} />
          <Route path="/cobros-renovaciones" element={<CobrosRenovaciones />} />
          <Route path="/gestion-membresias" element={<GestionMembresias />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </GymProvider>
  );
}

export default App;