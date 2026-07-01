import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [orden, setOrden] = useState('');
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const buscar = async () => {
    const params = {};
    if (origen) params.origen = origen;
    if (destino) params.destino = destino;
    if (fecha) params.fecha = fecha;
    const res = await api.get('/viajes', { params });
    let resultado = res.data;
    if (orden === 'precio_asc') resultado.sort((a, b) => a.precio - b.precio);
    if (orden === 'precio_desc') resultado.sort((a, b) => b.precio - a.precio);
    if (orden === 'hora_asc') resultado.sort((a, b) => a.hora.localeCompare(b.hora));
    if (orden === 'hora_desc') resultado.sort((a, b) => b.hora.localeCompare(a.hora));
    setViajes(resultado);
  };

  useEffect(() => { buscar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">🚌</div>
            <span className="font-bold text-lg tracking-tight">RutaExpress</span>
          </div>
          <div className="flex items-center gap-3">
            {usuario ? (
              <>
                <button onClick={() => navigate('/mis-pasajes')} className="text-sm text-zinc-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
                  🎫 Mis pasajes
                </button>
                <div className="w-px h-4 bg-white/20" />
                <span className="text-sm text-zinc-400">Hola, <span className="text-white font-medium">{usuario.nombre}</span></span>
                <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">Salir</button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-zinc-900 font-semibold text-sm px-4 py-2 rounded-xl">
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto px-6 py-16 relative">
          <h2 className="text-4xl font-bold text-center mb-2 tracking-tight">¿A dónde vas hoy?</h2>
          <p className="text-zinc-400 text-center mb-10">Encuentra y compra tu pasaje en segundos</p>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-3">
            <input
              placeholder="📍 Origen"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
            />
            <input
              placeholder="🏁 Destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
            />
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="flex-1 min-w-[140px] bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
            >
              <option value="">📊 Ordenar por</option>
              <option value="precio_asc">💰 Precio: menor a mayor</option>
              <option value="precio_desc">💰 Precio: mayor a menor</option>
              <option value="hora_asc">🕐 Hora: más temprano</option>
              <option value="hora_desc">🕐 Hora: más tarde</option>
            </select>
            <button
              onClick={buscar}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-900 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25 text-sm"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {viajes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-zinc-400">No se encontraron viajes para tu búsqueda</p>
          </div>
        ) : (
          <>
            <p className="text-zinc-400 text-sm mb-4">{viajes.length} viaje(s) encontrado(s)</p>
            <div className="grid gap-4">
              {viajes.map((v) => (
                <div key={v.id} className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-2xl p-5 transition-all group">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center text-lg">🚌</div>
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <span>{v.origen}</span>
                          <span className="text-cyan-400">→</span>
                          <span>{v.destino}</span>
                        </div>
                        <div className="text-zinc-400 text-sm mt-0.5">
                          📅 {v.fecha} &nbsp;·&nbsp; 🕐 {v.hora}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${Number(v.precio).toLocaleString('es-CL')}</div>
                        <div className="text-zinc-500 text-xs">por persona</div>
                      </div>
                      <button
                        onClick={() => navigate(`/asientos/${v.id}`)}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-900 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-cyan-500/20"
                      >
                        Ver asientos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}