import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

function Asignacion() {
  const [colaboradores, setColaboradores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [cambios, setCambios] = useState([]);

  useEffect(() => {
    const fetchColaboradores = async () => {
      const colaboradoresCollection = collection(db, 'colaboradores');
      const colaboradoresSnapshot = await getDocs(colaboradoresCollection);
      const colaboradoresData = colaboradoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setColaboradores(colaboradoresData);
    };

    const fetchProyectos = async () => {
      const proyectosCollection = collection(db, 'proyecto');
      const proyectosSnapshot = await getDocs(proyectosCollection);
      const proyectosData = proyectosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProyectos(proyectosData);
    };

    fetchColaboradores();
    fetchProyectos();
  }, []);

  const handleChange = (colaboradorId, proyectoId) => {
    const index = cambios.findIndex(cambio => cambio.colaboradorId === colaboradorId);
    if (index === -1) {
      setCambios([...cambios, { colaboradorId, proyectoId }]);
    } else {
      setCambios(cambios.map(cambio => cambio.colaboradorId === colaboradorId ? { ...cambio, proyectoId } : cambio));
    }
  };

  const guardarCambios = async () => {
    try {
      for (const cambio of cambios) {
        const colaboradorRef = doc(db, 'colaboradores', cambio.colaboradorId);
        const proyectoSeleccionado = proyectos.find(proyecto => proyecto.id === cambio.proyectoId);
        let estadoColaborador = "Trabajando en un proyecto";

        if (cambio.proyectoId === "eliminar") {
          estadoColaborador = "Libre";
        }

        await updateDoc(colaboradorRef, {
          proyecto: cambio.proyectoId === "eliminar" ? "" : proyectoSeleccionado.nombreProyecto,
          estado: estadoColaborador
        });
        console.log(`Colaborador ${cambio.colaboradorId} actualizado en la base de datos`);
      }

      setCambios([]);
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios. Consulta la consola para más detalles.");
    }
  };

  return (
    <div>
      <h1>Asignación</h1>
      <table>
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Proyecto</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(colaborador => (
            <tr key={colaborador.id}>
              <td>{colaborador.nombre}</td>
              <td>
                {colaborador.proyecto ? colaborador.proyecto : "Sin asignar"}
              </td>
              <td>
                <select
                  value={cambios.find(cambio => cambio.colaboradorId === colaborador.id)?.proyectoId || ""}
                  onChange={(e) => handleChange(colaborador.id, e.target.value)}>
                  <option value="">Seleccionar proyecto</option>
                  <option value="eliminar">Eliminar del Proyecto</option>
                  {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.id}>{proyecto.nombreProyecto}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={guardarCambios}>Guardar Cambios</button>

      <Link to="/gestionColaboradores">
        <button>Salir</button>
      </Link>
    </div>
  );
}

export default Asignacion;
