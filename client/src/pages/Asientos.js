import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Asientos() {
  const { viajeId } = useParams();
  const [asientos, setAsientos] = useState([]);
  const [viaje, setViaje] = useState(null);
  const [comprando, setComprando] = useState(false);
  const [error, setError] = useState('');
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const cargarDatos = async () => {
    const [asientosRes, viajesRes] = await Promise.all([
      api.get(`/asientos/${viajeId}`),
      api.get(`/viajes?id=${viajeId}`),
    ]);
    setAsientos(asientosRes.data);
    if (viajesRes.data.length > 0) setViaje(viajesRes.data[0]);
  };

  useEffect(() => { cargarDatos(); }, [viajeId]);

  const comprar = async (asientoId) => {
    if (!usuario) { navigate('/login'); return; }
    setError('');
    setComprando(true);
    try {
      await api.post('/pasajes', { viajeId, asientoId });
      navigate('/mis-pasajes');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al comprar el pasaje');
      cargarDatos();
    } finally {
      setComprando(false);
    }
  };

  const disponibles = asientos.filter(a => a.disponible).length;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">🚌</div>
            <span className="font-bold text-lg tracking-tight">RutaExpress</span>
          </div>
          <button
            onClick={() => navigate('/viajes')}
            className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Info del viaje */}
        {viaje && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <span>{viaje.origen}</span>
                  <span className="text-cyan-400">→</span>
                  <span>{viaje.destino}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">📅 {viaje.fecha} &nbsp;·&nbsp; 🕐 {viaje.hora}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${Number(viaje.precio).toLocaleString('es-CL')}</div>
                <div className="text-zinc-500 text-xs">{disponibles} asientos disponibles</div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-2">Selecciona tu asiento</h2>
        <p className="text-zinc-400 text-sm mb-6">Haz clic en un asiento disponible para comprarlo</p>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Mapa de asientos */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          {/* Frente del bus */}
          <div className="text-center mb-6">
            <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-2 text-zinc-400 text-sm">
              🚌 Frente del bus
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 max-w-sm mx-auto">
            {asientos.map((a) => (
              <button
                key={a.id}
                disabled={!a.disponible || comprando}
                onClick={() => comprar(a.id)}
                className={`
                  relative aspect-square rounded-xl text-sm font-bold transition-all
                  ${a.disponible
                    ? 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/40 hover:from-cyan-400/40 hover:to-blue-500/40 hover:border-cyan-400 text-cyan-300 hover:scale-105 cursor-pointer'
                    : 'bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed'
                  }
                `}
              >
                {a.numero}
                {!a.disponible && (
                  <span className="absolute inset-0 flex items-center justify-center text-zinc-500 text-lg">✕</span>
                )}
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-6 mt-8 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/40" />
              Disponible
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10" />
              Ocupado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}