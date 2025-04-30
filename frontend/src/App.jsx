import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2, Plus, Frown, Edit3 } from 'lucide-react';

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const vite_url_api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${vite_url_api}/tareas`).then(res => setTareas(res.data));
  }, []);

  const agregarTarea = async () => {
    if (!titulo.trim()) return;
    if (modoEdicion) {
      const res = await axios.post(`${vite_url_api}/tareas/${idEditando}`, { titulo });
      setTareas(tareas.map(t => (t._id === idEditando ? res.data : t)));
      setModoEdicion(false);
      setIdEditando(null);
    } else {
      const res = await axios.post(`${vite_url_api}/tareas/${idEditando}`, { titulo });
      setTareas([...tareas, res.data]);
    }
    setTitulo('');
  };

  const completarTarea = async (id) => {
    const tarea = tareas.find(t => t._id === id);
    const res = await axios.post(`${vite_url_api}/tareas/${idEditando}`, { ...tarea, completada: !tarea.completada });
    setTareas(tareas.map(t => (t._id === id ? res.data : t)));
  };

  const eliminarTarea = async (id) => {
    await axios.delete(`${vite_url_api}/tareas/${idEditando}`);
    setTareas(tareas.filter(t => t._id !== id));
  };

  const editarTarea = (tarea) => {
    setTitulo(tarea.titulo);
    setModoEdicion(true);
    setIdEditando(tarea._id);
  };

  const completarTodas = async () => {
    const updatedTareas = await Promise.all(tareas.map(async (tarea) => {
      if (!tarea.completada) {
        const res = await axios.put(`${vite_url_api}/tareas/${tarea._id}`, { ...tarea, completada: true });
        return res.data;
      }
      return tarea;
    }));
    setTareas(updatedTareas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-pink-200 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">🎯 Organizador de Tareas</h1>
        <p className="text-center text-gray-500 mb-6">¡Gestiona tu día con estilo y productividad!</p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            className="border border-gray-300 p-3 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Escribe una nueva tarea"
          />
          <button
            onClick={agregarTarea}
            className={`${
              modoEdicion ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1 shadow-md transition`}
          >
            <Plus size={18} /> {modoEdicion ? 'Actualizar' : 'Añadir'}
          </button>
        </div>

        <button
          onClick={completarTodas}
          className="mb-6 w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 rounded-lg shadow-md transition"
        >
          ✅ Completar Todas
        </button>

        {tareas.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <Frown className="mx-auto mb-2" size={36} />
            No hay tareas por ahora...
          </div>
        ) : (
          <ul className="space-y-4">
            {tareas.map((tarea) => (
              <motion.li
                key={tarea._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <span className={`text-lg font-medium ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {tarea.titulo}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => completarTarea(tarea._id)}
                    className={`px-3 py-1 rounded-full font-medium text-white transition flex items-center gap-1 ${tarea.completada ? 'bg-yellow-400' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    <CheckCircle size={16} /> {tarea.completada ? 'Desmarcar' : 'Completar'}
                  </button>
                  <button
                    onClick={() => editarTarea(tarea)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium flex items-center gap-1 transition"
                  >
                    <Edit3 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => eliminarTarea(tarea._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium flex items-center gap-1 transition"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;