import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Operador() {
  const [viajes, setViajes] = useState([]);
  const [form, setForm] = useState({ origen: '', destino: '', fecha: '', hora: '', precio: '', totalAsientos: 40 });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cargarViajes = async () => {
    const res = await api.get('/viajes');
    setViajes(res.data);
  };

  useEffect(() => {
    if (!usuario || usuario.rol !== 'operador') {
      navigate('/viajes');
      return;
    }
    cargarViajes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!form.origen || !form.destino || !form.fecha || !form.hora || !form.precio || !form.totalAsientos) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (Number(form.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    if (Number(form.totalAsientos) < 1 || Number(form.totalAsientos) > 40) {
      setError('El total de asientos debe ser entre 1 y 40');
      return;
    }

    if (form.origen.trim().toLowerCase() === form.destino.trim().toLowerCase()) {
  setError('El origen y destino no pueden ser iguales');
  return;
}
    try {
      if (editando) {
        await api.put(`/viajes/${editando}`, form);
        setExito('Viaje actualizado correctamente');
        setEditando(null);
      } else {
        await api.post('/viajes', form);
        setExito('Viaje creado correctamente');
      }
      setForm({ origen: '', destino: '', fecha: '', hora: '', precio: '', totalAsientos: 40 });
      cargarViajes();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el viaje');
    }
  };

  const handleEditar = (v) => {
    setEditando(v.id);
    setForm({ origen: v.origen, destino: v.destino, fecha: v.fecha, hora: v.hora, precio: v.precio, totalAsientos: v.totalAsientos });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este viaje?')) return;
    try {
      await api.delete(`/viajes/${id}`);
      setExito('Viaje eliminado');
      cargarViajes();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ origen: '', destino: '', fecha: '', hora: '', precio: '', totalAsientos: 40 });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">🚌</div>
            <span className="font-bold text-lg tracking-tight">RutaExpress</span>
            <span className="ml-2 text-xs bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded-full">Operador</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Hola, <span className="text-white font-medium">{usuario?.nombre}</span></span>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">Salir</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulario */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {editando ? '✏️ Editar viaje' : '➕ Nuevo viaje'}
            </h2>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'origen', label: 'Origen', placeholder: 'Ej: Santiago', type: 'text' },
                  { name: 'destino', label: 'Destino', placeholder: 'Ej: Valparaíso', type: 'text' },
                  { name: 'fecha', label: 'Fecha', placeholder: '', type: 'date' },
                  { name: 'hora', label: 'Hora', placeholder: '', type: 'time' },
                  { name: 'precio', label: 'Precio ($)', placeholder: 'Ej: 15000', type: 'number' },
                  { name: 'totalAsientos', label: 'Total de asientos', placeholder: '40', type: 'number' },
                ].map(({ name, label, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
                    />
                  </div>
                ))}

                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    ⚠️ {error}
                  </div>
                )}
                {exito && (
                  <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    ✓ {exito}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-900 font-semibold py-3 rounded-xl transition-all text-sm"
                  >
                    {editando ? 'Guardar cambios' : 'Crear viaje'}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      onClick={handleCancelar}
                      className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 text-sm transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de viajes */}
          <div>
            <h2 className="text-xl font-bold mb-6">📋 Viajes registrados</h2>

            {viajes.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <div className="text-4xl mb-3">🚌</div>
                <p>No hay viajes registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {viajes.map((v) => (
                  <div
                    key={v.id}
                    className={`backdrop-blur-xl bg-white/5 border rounded-2xl p-4 transition-all ${editando === v.id ? 'border-cyan-400/50' : 'border-white/10'}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          <span>{v.origen}</span>
                          <span className="text-cyan-400">→</span>
                          <span>{v.destino}</span>
                        </div>
                        <div className="text-zinc-400 text-xs mt-1">
                          📅 {v.fecha} · 🕐 {v.hora} · 💺 {v.totalAsientos} asientos
                        </div>
                        <div className="text-white font-bold mt-1">${Number(v.precio).toLocaleString('es-CL')}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditar(v)}
                          className="text-xs bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-400 px-3 py-1.5 rounded-lg transition-all"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(v.id)}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}