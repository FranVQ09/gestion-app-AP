import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function ConsultarProyectos() {

  const [proyectoItems, setProyectoItems] = useState([]);

  useEffect(() => {
    const getProyectoItems = async () => {
      const querySnapshot = await getDocs(collection(db, "proyecto"));
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const proyectoItem = {
          id: doc.id,
          nombreProyecto: data.nombreProyecto,
          recursos: data.recursos,
          presupuesto: data.presupuesto,
          colaboradores: data.colaboradores,
          tareas: data.tareas,
          estadoProyecto: data.estadoProyecto,
          descripcion: data.descripcion,
          historial: data.historial,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        };
        items.push(proyectoItem);
      });
      setProyectoItems(items);
    };

    getProyectoItems();
  }, []);

  return(
    <div>
      <h1>Consultar Proyectos</h1>
      {proyectoItems.map((item) => (
        <div key={item.id}>
          <h3>{item.nombreProyecto}</h3>
          <p>{item.descripcion}</p>
          <p>Recursos: {item.recursos}</p>
          <p>Presupuesto: {item.presupuesto}</p>
          <p>Colaboradores: {item.colaboradores.join(', ')}</p>
          <p>Estado: {item.estadoProyecto}</p>
          <p>Fecha de inicio: {item.fechaInicio || 'No disponible'}</p>
          <p>Fecha de fin: {item.fechaFin || 'No disponible'}</p>
          <p>Historial: {item.historial}</p>
          <h4>Tareas:</h4>
          <ul>
            {item.tareas.map((tarea, index) => (
              <div key={index}>
                <h5>{tarea.nombreTarea}</h5>
                <p>{tarea.descripcion}</p>
                <p>Estado: {tarea.estado}</p>
                <p>Fecha de inicio: {tarea.fechaInicio || 'No disponible'}</p>
                <p>Fecha de fin: {tarea.fechaFin || 'No disponible'}</p>
                <p>Responsable: {tarea.responsable}</p>
                <p>Storypoints: {tarea.storypoints}</p>
              </div>
            ))}
          </ul>
          <hr /> {/* Línea divisoria entre proyectos */}
        </div>
      ))}
      <Link to="/gestionProyectos">
        <button>Salir</button>
      </Link>
    </div>
  );
}

export default ConsultarProyectos;
