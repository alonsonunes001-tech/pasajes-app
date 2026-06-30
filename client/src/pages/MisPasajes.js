import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MisPasajes() {
  const [pasajes, setPasajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/pasajes/mis-pasajes')
      .then((res) => setPasajes(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">🚌</div>
            <span className="font-bold text-lg tracking-tight">RutaExpress</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/viajes')} className="text-sm text-zinc-400 hover:text-white transition-colors">
              ← Buscar viajes
            </button>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-sm text-zinc-400">Hola, <span className="text-white font-medium">{usuario?.nombre}</span></span>
            <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">Salir</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center">🎫</div>
          <div>
            <h2 className="text-2xl font-bold">Mis pasajes</h2>
            <p className="text-zinc-400 text-sm">{pasajes.length} pasaje(s) comprado(s)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-400">Cargando...</div>
        ) : pasajes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎫</div>
            <p className="text-zinc-400 mb-4">Aún no tienes pasajes comprados</p>
            <button
              onClick={() => navigate('/viajes')}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-zinc-900 font-semibold px-6 py-2.5 rounded-xl text-sm"
            >
              Buscar viajes
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {pasajes.map((p) => (
              <div key={p.id} className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-violet-400/30 rounded-2xl p-5 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center text-lg">🚌</div>
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-lg">
                        <span>{p.Viaje?.origen}</span>
                        <span className="text-violet-400">→</span>
                        <span>{p.Viaje?.destino}</span>
                      </div>
                      <div className="text-zinc-400 text-sm mt-0.5">
                        📅 {p.Viaje?.fecha} &nbsp;·&nbsp; 🕐 {p.Viaje?.hora} &nbsp;·&nbsp; 💺 Asiento {p.Asiento?.numero}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold">${Number(p.precio).toLocaleString('es-CL')}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/comprobante/${p.id}`)}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      Ver comprobante
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}