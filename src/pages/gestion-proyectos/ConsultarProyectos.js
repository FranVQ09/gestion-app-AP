import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../../styles/ConsultarProyecto.css'; 

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

  const storeProyect = (e) => {
    // Agrega aquí la lógica para almacenar el proyecto si es necesario
  };

  return(
    <div className='content'>
      <div className='flex-div'>
        <div className='name-content'>
          <h1 className='logo'>Consultar Proyecto</h1>
        </div>
        <form className='consuproye' onSubmit={storeProyect}>
          {proyectoItems.map((item) => (
            <div key={item.id}>
              <h3>Nombre del Proyecto: <span class='logo'>{item.nombreProyecto}</span></h3>
              <p>Descripción: {item.descripcion}</p>
              <p>Recursos: {item.recursos}</p>
              <p>Presupuesto: {item.presupuesto}</p>
              <p>Colaboradores: {item.colaboradores ? item.colaboradores.join(', ') : 'No hay colaboradores'}</p>
              <p>Estado: {item.estadoProyecto}</p>
              <p>Fecha de inicio: {item.fechaInicio || 'No disponible'}</p>
              <p>Fecha de fin: {item.fechaFin || 'No disponible'}</p>
              <p>Historial: {item.historial}</p>
              <br></br>
              <h4>Tareas:</h4>
              <ul>
                {item.tareas.map((tarea, index) => (
                  <div key={index}>
                    <h5>Nombre de la Tarea: <span class='logo2'>{tarea.nombreTarea}</span></h5>
                    <p>Descripción de la Tarea: {tarea.descripcion}</p>
                    <p>Estado: {tarea.estado}</p>
                    <p>Fecha de inicio: {tarea.fechaInicio || 'No disponible'}</p>
                    <p>Fecha de fin: {tarea.fechaFin || 'No disponible'}</p>
                    <p>Responsable: {tarea.responsable}</p>
                    <p>Storypoints: {tarea.storypoints}</p>
                    <br></br>
                  </div>
                ))}
              </ul>
              <hr /> {/* Línea divisoria entre proyectos */}
              <br/>
            </div>
            
          ))}
          <div>
            <Link className='consuback' type="button" to="/gestionProyectos">Regresar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsultarProyectos;
