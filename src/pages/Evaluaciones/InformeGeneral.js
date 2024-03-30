import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import Chart from 'chart.js/auto';
import { collection, query, getDocs, where } from 'firebase/firestore';

function InformeGeneral() {
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState('');
  const [tareas, setTareas] = useState([]);

  // Obtener todos los proyectos disponibles
  const obtenerProyectos = async () => {
    const proyectosRef = collection(db, 'proyecto');
    const querySnapshot = await getDocs(proyectosRef);
    const proyectosData = querySnapshot.docs.map(doc => doc.data());
    setProyectos(proyectosData);
  };

  // Obtener las tareas del proyecto seleccionado
  const obtenerTareas = async (nombreProyecto) => {
    const proyectoRef = collection(db, 'proyecto');
    const querySnapshot = await getDocs(query(proyectoRef, where('nombreProyecto', '==', nombreProyecto)));
    const proyectoData = querySnapshot.docs[0].data();
    const tareasDelProyecto = proyectoData.tareas;
    setTareas(tareasDelProyecto);
  };

  // Calculamos el progreso de cada tarea
  const calcularProgresoTareas = (tareas) => {
    const progresos = [];
    const fechaActual = new Date();

    tareas.forEach(tarea => {
      // Convertir las fechas a objetos de fecha
      const fechaInicioArray = tarea.fechaInicio.split('/');
      const fechaInicio = new Date(`${fechaInicioArray[2]}-${fechaInicioArray[1]}-${fechaInicioArray[0]}`);
      const fechaFinArray = tarea.fechaFin.split('/');
      const fechaFin = new Date(`${fechaFinArray[2]}-${fechaFinArray[1]}-${fechaFinArray[0]}`);

      // Calcular la duración total de la tarea en días
      const duracionTotal = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);

      // Calcular los días transcurridos desde la fecha de inicio
      const diasTranscurridos = (fechaActual - fechaInicio) / (1000 * 60 * 60 * 24);

      // Calcular el progreso como un valor entre 0 y 1
      const progreso = Math.min(diasTranscurridos / duracionTotal, 1);

      progresos.push(progreso);
    });

    return progresos;
  };

  useEffect(() => {
    // Obtener todos los proyectos disponibles al cargar el componente
    obtenerProyectos();
  }, []);

  useEffect(() => {
    // Obtener las tareas del proyecto seleccionado al cambiar el proyecto seleccionado
    if (selectedProyecto !== '') {
      obtenerTareas(selectedProyecto);
    }
  }, [selectedProyecto]);

  useEffect(() => {
    // Obtener el contexto del lienzo del gráfico
    const ctx = document.getElementById('myChart');

    // Obtener los progresos de las tareas
    const progresos = calcularProgresoTareas(tareas);

    // Configurar los datos del gráfico
    const data = {
      labels: tareas.map(tarea => tarea.nombreTarea), // Nombres de las tareas en el eje x
      datasets: [{
        label: 'Progreso de las tareas',
        data: progresos, // Progreso de cada tarea en el eje y
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color de las barras
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las barras
        borderWidth: 1
      }]
    };

    // Configurar las opciones del gráfico
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 1 // El eje y representa el progreso, que está entre 0 y 1
        }
      }
    };

    // Crear el gráfico de barras
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });

    // Devolvemos una función para limpiar el gráfico al desmontar el componente
    return () => myChart.destroy();
  }, [tareas]);

  // Manejar el cambio en el dropdown de proyectos
  const handleProyectoChange = (event) => {
    setSelectedProyecto(event.target.value);
  };

  return (
    <div>
      <h1>Informe General</h1>
      <div>
        {/* Dropdown para seleccionar el proyecto */}
        <select value={selectedProyecto} onChange={handleProyectoChange}>
          <option value="">Selecciona un proyecto</option>
          {proyectos.map(proyecto => (
            <option key={proyecto.nombreProyecto} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
          ))}
        </select>
        <Link to="/evaluaciones">
          <button>
            Salir
          </button>
        </Link>
      </div>
      <canvas id="myChart" width="300" height="300"></canvas>
    </div>
  )
}

export default InformeGeneral;

