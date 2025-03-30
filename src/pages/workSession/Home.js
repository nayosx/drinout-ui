import React, { useState } from 'react';
import { getWorkSessionsReport } from '../../api/workSessions';

const WorkSessionReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleFetchJson = async () => {
    try {
      const data = await getWorkSessionsReport(startDate, endDate);
      setReportData(data.report);
    } catch (error) {
      alert('Error al obtener el reporte JSON');
      console.error(error);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      await getWorkSessionsReport(startDate, endDate, true);
    } catch (error) {
      alert('Error al descargar el CSV');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reporte de Sesiones de Trabajo</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleFetchJson}
        >
          Consultar JSON
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleDownloadCsv}
        >
          Descargar CSV
        </button>
      </div>

      <div>
        {reportData.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Sesiones</th>
                <th className="border p-2">Duración Total</th>
                <th className="border p-2">Extra</th>
                <th className="border p-2">Faltante</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((session) => (
                <tr key={session.user_id}>
                  <td className="border p-2">{session.user_id}</td>
                  <td className="border p-2">{session.nombre_usuario}</td>
                  <td className="border p-2">{session.total_sesiones}</td>
                  <td className="border p-2">{session.total_duracion}</td>
                  <td className="border p-2">{session.total_extra}</td>
                  <td className="border p-2">{session.total_faltante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkSessionReport;
