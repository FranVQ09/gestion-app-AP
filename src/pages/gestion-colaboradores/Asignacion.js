import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';

function ColaboradoresTabla() {
  const [colaboradores, setColaboradores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectosSeleccionados, setProyectosSeleccionados] = useState({});

  useEffect(() => {
    const obtenerColaboradores = async () => {
      const colaboradoresSnapshot = await getDocs(collection(db, 'colaboradores'));
      const colaboradoresData = colaboradoresSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
        proyecto: doc.data().proyecto || 'Sin asignar',
        estado: doc.data().estado || 'Libre'
      }));
      setColaboradores(colaboradoresData);
    };

    const obtenerProyectos = async () => {
      const proyectosSnapshot = await getDocs(collection(db, 'proyecto'));
      const proyectosData = proyectosSnapshot.docs.map(doc => ({
        id: doc.id,
        nombreProyecto: doc.data().nombreProyecto,
        colaboradores: doc.data().colaboradores || []
      }));
      setProyectos(proyectosData);
    };

    obtenerColaboradores();
    obtenerProyectos();
  }, []);

  const handleAsignarProyecto = async (colaboradorId, colaboradorNombre) => {
    const proyectoSeleccionado = proyectosSeleccionados[colaboradorId];
    try {
      if (proyectoSeleccionado === 'Eliminar') {
        await eliminarColaboradorDeProyecto(colaboradorNombre, colaboradorId);
      } else {
        await updateDoc(doc(db, 'colaboradores', colaboradorId), { proyecto: proyectoSeleccionado });
        const proyectoActualizado = proyectos.find(proyecto => proyecto.nombreProyecto === proyectoSeleccionado);
        if (proyectoActualizado) {
          const colaboradoresActualizados = arrayUnion(colaboradorNombre);
          await updateDoc(doc(db, 'proyecto', proyectoActualizado.id), { colaboradores: colaboradoresActualizados });
        }
        await updateDoc(doc(db, 'colaboradores', colaboradorId), { estado: 'Trabajando en proyecto' });
        
        // Actualizar el estado local de los colaboradores después de asignar el proyecto
        setColaboradores(prevColaboradores => {
          return prevColaboradores.map(colaborador => {
            if (colaborador.id === colaboradorId) {
              return { ...colaborador, proyecto: proyectoSeleccionado, estado: 'Trabajando en proyecto' };
            } else {
              return colaborador;
            }
          });
        });
      }
      alert('Modificación realizada');
    } catch (error) {
      console.error('Error al asignar proyecto:', error);
    }
  };

  const eliminarColaboradorDeProyecto = async (colaboradorNombre, colaboradorId) => {
    try {
      for (const proyecto of proyectos) {
        if (proyecto.colaboradores.includes(colaboradorNombre)) {
          const colaboradoresActualizados = arrayRemove(colaboradorNombre);
          await updateDoc(doc(db, 'proyecto', proyecto.id), { colaboradores: colaboradoresActualizados });
        }
      }
      await updateDoc(doc(db, 'colaboradores', colaboradorId), { estado: 'Libre' });
      await updateDoc(doc(db, 'colaboradores', colaboradorId), { proyecto: 'Sin asignar' });
      
      // Actualizar el estado local de los colaboradores después de eliminar el proyecto
      setColaboradores(prevColaboradores => {
        return prevColaboradores.map(colaborador => {
          if (colaborador.id === colaboradorId) {
            return { ...colaborador, proyecto: 'Sin asignar', estado: 'Libre' };
          } else {
            return colaborador;
          }
        });
      });
    } catch (error) {
      console.error('Error al eliminar colaborador de proyecto:', error);
    }
  };

  const handleSeleccionProyecto = (colaboradorId, proyectoNombre) => {
    setProyectosSeleccionados({
      ...proyectosSeleccionados,
      [colaboradorId]: proyectoNombre
    });
  };

  return (
    <div>
      <h2>Menú de Asignación</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre Colaborador</th>
            <th>Proyecto</th>
            <th>Asignar</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(colaborador => (
            <tr key={colaborador.id}>
              <td>{colaborador.nombre}</td>
              <td>{colaborador.proyecto}</td>
              <td>
                <select value={proyectosSeleccionados[colaborador.id] || ''} onChange={e => handleSeleccionProyecto(colaborador.id, e.target.value)}>
                  <option value="">Seleccionar Proyecto</option>
                  {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.nombreProyecto}>
                      {proyecto.nombreProyecto}
                    </option>
                  ))}
                  {colaborador.proyecto && (
                    <option value="Eliminar">Eliminar</option>
                  )}
                </select>
                <button onClick={() => handleAsignarProyecto(colaborador.id, colaborador.nombre)}>
                  Asignar
                </button>
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

export default ColaboradoresTabla;
