import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';

function Asignacion() {
  const [colaboradores, setColaboradores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState('');

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

  const handleDeleteColaborador = async (colaboradorId) => {
   
    console.log(`Eliminar colaborador con ID: ${colaboradorId}`);
  };

  const handleReasignarColaborador = async (colaboradorId, proyectoId) => {
    console.log(`Reasignar colaborador con ID: ${colaboradorId} al proyecto con ID: ${proyectoId}`);
  };

  return (
    <div>
      <h1>Asignación</h1>
      <table>
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Proyecto</th>
            <th>Reasignar</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(colaborador => (
            <tr key={colaborador.id}>
              <td>{colaborador.nombre}</td>
              <td>
                {colaborador.proyecto ? colaborador.proyecto : 'Sin asignar'}
              </td>
              <td>
                <button onClick={() => handleDeleteColaborador(colaborador.id)}>Eliminar</button>
                <select onChange={(e) => handleReasignarColaborador(colaborador.id, e.target.value)}>
                  <option value="">Selecciona un proyecto</option>
                  {proyectos.length === 0 ? (
                    <option value="" disabled>Cargando proyectos...</option>
                  ) : (
                    proyectos.map(proyecto => (
                      <option key={proyecto.id} value={proyecto.id}>{proyecto.nombreProyecto}</option>
                    ))
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/gestionColaboradores">
        <button>Salir</button>
      </Link>
    </div>
  );
}

export default Asignacion;