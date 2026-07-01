import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import api from '../services/api';

export default function Comprobante() {
  const { id } = useParams();
  const [pasaje, setPasaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pasajes/${id}`).then((res) => setPasaje(res.data));
  }, [id]);

  const descargarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de pasaje', 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(`Pasaje #${pasaje.id}`, 20, 28);

    doc.setDrawColor(200);
    doc.line(20, 34, 190, 34);

    const datos = [
      ['Pasajero', pasaje.Usuario?.nombre || '-'],
      ['Origen', pasaje.Viaje?.origen || '-'],
      ['Destino', pasaje.Viaje?.destino || '-'],
      ['Fecha', pasaje.Viaje?.fecha || '-'],
      ['Hora', pasaje.Viaje?.hora || '-'],
      ['Asiento', `N° ${pasaje.Asiento?.numero ?? '-'}`],
      ['Precio', `$${Number(pasaje.precio).toLocaleString('es-CL')}`],
    ];

    let y = 48;
    doc.setFontSize(12);
    datos.forEach(([label, value]) => {
      doc.setTextColor(100);
      doc.text(`${label}:`, 20, y);
      doc.setTextColor(20);
      doc.text(`${value}`, 70, y);
      y += 10;
    });

    doc.setDrawColor(200);
    doc.line(20, y + 2, 190, y + 2);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('RutaExpress - Comprobante generado electrónicamente', 20, y + 10);

    doc.save(`comprobante-pasaje-${pasaje.id}.pdf`);
  };

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
          <div className="p-6 space-y-3">
            <button
              onClick={descargarPDF}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-900 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              📄 Descargar PDF
            </button>
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