import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, query, where} from 'firebase/firestore';
import Chart from 'chart.js/auto';

function BurndownChart() {
  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tareas, setTareas] = useState([]);

  const obtenerProyectos = async () => {
    //Obtener todos los proyectos disponibles
    try {
      const proyectosRef = collection(db, 'proyecto');
      const querySnapshot = await getDocs(proyectosRef);
      const proyectoDatos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectoDatos);
    } catch (error) {
      console.error('Error: No se encontro el proyecto', error);
    }
  };


  const obtenerTareas = async (nombreProyecto) => {
    // Obtener las tareas del proyecto seleccionado
    try{
      const proyectoRef = collection(db, 'proyecto'); //Referencia de la colección proyecto
      const querySnapshot = await getDocs(query(proyectoRef, where('nombreProyecto', '==', nombreProyecto))); //Buscar el proyecto por nombre y obtener las tareas
      const proyectoData = querySnapshot.docs[0].data(); //Obtener los datos del proyecto
      const tareasDelProyecto = proyectoData.tareas; //Obtener las tareas del proyecto
      setTareas(tareasDelProyecto); //Actualizar el estado de las tareas
      console.log(tareasDelProyecto);
    } catch (error) {
      console.error('Error: No se encontro la tarea', error);
    }
  }

  const crearBurndownChart = () => {
    const canvas = document.getElementById('burndownChart');
    const chartInstance = Chart.getChart(canvas);
  
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    const proyectoActual = proyectos.find(proyecto => proyecto.nombreProyecto === selectedProject);
  
    if (!proyectoActual) {
      console.error('Error: No se encontró el proyecto seleccionado');
      return;
    }
  
    const { fechaInicio, fechaFin, tareas } = proyectoActual;
  
    const fechaInicioProyecto = new Date(fechaInicio);
    const fechaFinProyecto = new Date(fechaFin);
  
    const puntosPorDia = [];
  
    const tareaPorDia = {};
  
    tareas.forEach(tarea => {
      const fechaInicioTarea = new Date(tarea.fechaInicio);
      const fechaFinTarea = new Date(tarea.fechaFin);
      const storyPoints = tarea.storypoints;
  
      let currentDate = new Date(fechaInicioTarea);
      while (currentDate <= fechaFinTarea) {
        const formattedDate = currentDate.toLocaleDateString();
        tareaPorDia[formattedDate] = (tareaPorDia[formattedDate] || 0) + storyPoints;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  
    let currentDate = new Date(fechaInicioProyecto);
    while (currentDate <= fechaFinProyecto) {
      const formattedDate = currentDate.toLocaleDateString();
      puntosPorDia.push({ fecha: currentDate, puntos: tareaPorDia[formattedDate] || 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    const labels = puntosPorDia.map(item => item.fecha.toLocaleDateString());
    const data = puntosPorDia.map(item => item.puntos);
  
    const ctx = document.getElementById('burndownChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Progreso Real',
          data: data,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };


  useEffect(() => {
    // Función para obtener datos del proyecto
    obtenerProyectos();
  }, []);

  useEffect(() => {
    if (selectedProject !== ''){
      obtenerTareas(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (tareas.length > 0){
      crearBurndownChart();
    }
  }, [tareas]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  return (
    <div>
      <h1>Burndown Chart</h1>
      <div>
        <label htmlFor="projectDropdown">Seleccionar Proyecto:</label>
        <select id="projectDropdown" value={selectedProject} onChange={handleProjectChange}>
          <option value="">Seleccionar...</option>
          {proyectos.map(proyecto => (
            <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
          ))}
        </select>
      </div>
      <div>
        <canvas id="burndownChart" width='400' height='400'></canvas>
      </div>
      <div>
        <Link to="/evaluaciones">
          <button>Salir</button>
        </Link>
      </div>
    </div>
  );
}

export default BurndownChart;
