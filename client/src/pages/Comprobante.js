import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Comprobante() {
  const { id } = useParams();
  const [pasaje, setPasaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pasajes/${id}`).then((res) => setPasaje(res.data));
  }, [id]);

  if (!pasaje) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-zinc-400">
      Cargando comprobante...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-center">
            <div className="text-4xl mb-2">🎫</div>
            <h2 className="text-xl font-bold">Comprobante de pasaje</h2>
            <p className="text-violet-200 text-sm mt-1">Pasaje #{pasaje.id}</p>
          </div>

          {/* Divisor con círculos */}
          <div className="relative flex items-center">
            <div className="absolute -left-4 w-8 h-8 bg-[#0a0a0c] rounded-full" />
            <div className="flex-1 border-t border-dashed border-white/20 mx-4" />
            <div className="absolute -right-4 w-8 h-8 bg-[#0a0a0c] rounded-full" />
          </div>

          {/* Datos */}
          <div className="p-6 space-y-4">
            {[
              { label: 'Pasajero', value: pasaje.Usuario?.nombre, icon: '👤' },
              { label: 'Origen', value: pasaje.Viaje?.origen, icon: '📍' },
              { label: 'Destino', value: pasaje.Viaje?.destino, icon: '🏁' },
              { label: 'Fecha', value: pasaje.Viaje?.fecha, icon: '📅' },
              { label: 'Hora', value: pasaje.Viaje?.hora, icon: '🕐' },
              { label: 'Asiento', value: `Nº ${pasaje.Asiento?.numero}`, icon: '💺' },
              { label: 'Precio', value: `$${Number(pasaje.precio).toLocaleString('es-CL')}`, icon: '💵' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm flex items-center gap-2">
                  {icon} {label}
                </span>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Divisor */}
          <div className="relative flex items-center">
            <div className="absolute -left-4 w-8 h-8 bg-[#0a0a0c] rounded-full" />
            <div className="flex-1 border-t border-dashed border-white/20 mx-4" />
            <div className="absolute -right-4 w-8 h-8 bg-[#0a0a0c] rounded-full" />
          </div>

          {/* Footer */}
          <div className="p-6">
            <button
              onClick={() => navigate('/mis-pasajes')}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Volver a mis pasajes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}