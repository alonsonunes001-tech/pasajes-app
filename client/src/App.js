import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Viajes from './pages/Viajes';
import Asientos from './pages/Asientos';
import MisPasajes from './pages/MisPasajes';
import Comprobante from './pages/Comprobante';
import Operador from './pages/Operador';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/viajes" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/viajes" element={<Viajes />} />
          <Route path="/asientos/:viajeId" element={<Asientos />} />
          <Route path="/mis-pasajes" element={<MisPasajes />} />
          <Route path="/comprobante/:id" element={<Comprobante />} />
          <Route path="/operador" element={<Operador />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;