import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import '../../styles/CrearProyecto.css';  
import { countProyectos } from '../../util';


function CrearProyecto() {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [recursos, setRecursos] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const [tareas, setTareas] = useState([]);
    const [estadoProyecto, setEstadoProyecto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [historial, setHistorial] = useState([]);

    const proyectosCollection = collection(db, 'proyecto');

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    

    const agregarTarea = () => {
        // Verificar si hay alguna tarea con todos los campos vacíos
        const nuevaTareaVacia = tareas.some(tarea => Object.values(tarea).every(value => value === ''));
        if (nuevaTareaVacia) {
          alert('Por favor, complete todos los campos de la nueva tarea antes de agregarla.');
          return;
        }
      
        // Validar el formato de fecha para las nuevas tareas
        const fechaInvalida = tareas.some(tarea => !/^\d{2}\/\d{2}\/\d{4}$/.test(tarea.fechaInicio) || !/^\d{2}\/\d{2}\/\d{4}$/.test(tarea.fechaFin));
        if (fechaInvalida) {
          alert('El formato de las fechas de inicio y fin de la tarea debe ser "dd/mm/aaaa".');
          return;
        }
      
        // Si no hay ninguna tarea vacía ni fechas inválidas, agregar una nueva tarea vacía al arreglo de tareas
        const nuevaTarea = {
          nombreTarea: '',
          descripcion: '',
          estado: '',
          storypoints: 0,
          fechaInicio: '',
          fechaFin: ''
        };
        setTareas([...tareas, nuevaTarea]);
      };

    const deshacerTarea = () => {
        if (tareas.length === 0) {
            alert('No hay tareas para deshacer.');
            return;
        }
        const nuevasTareas = [...tareas];
        nuevasTareas.pop();
        setTareas(nuevasTareas);
        const nuevoHistorial = [...historial];
        nuevoHistorial.pop();
        setHistorial(nuevoHistorial);
    };

    const actualizarTarea = (index, campo, valor) => {
        const nuevasTareas = [...tareas];
        nuevasTareas[index][campo] = valor;
        setTareas(nuevasTareas);
    };

    const storeProyect = async (e) => {
        e.preventDefault();

        const fechaInicioRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!fechaInicio.match(fechaInicioRegex)) {
            alert('El formato de la fecha de inicio debe ser "dd/mm/aaaa".');
            return;
        }

        const fechaFinRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!fechaFin.match(fechaFinRegex)) {
            alert('El formato de la fecha de fin debe ser "dd/mm/aaaa".');
            return;
        }

        const tareasValidas = tareas.every(tarea => Object.values(tarea).some(value => value !== ''));
        if (!tareasValidas) {
            alert('Por favor, complete todos los campos de las tareas antes de guardar el proyecto.');
            return;
        }
        try {
            const nombresTareas = tareas.map(tarea => `Se agregó: ${tarea.nombreTarea}`);
            const historialActualizado = [...historial, ...nombresTareas];
            await addDoc(proyectosCollection, { 
                nombreProyecto: nombreProyecto,
                encargado: userData.nombre,
                descripcion: descripcion,
                recursos: recursos,
                presupuesto: presupuesto,
                tareas: tareas,
                estadoProyecto: estadoProyecto,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                historial: historialActualizado
            });
            alert('Proyecto registrado correctamente');
            setNombreProyecto('');
            setRecursos('');
            setPresupuesto('');
            setTareas([]);
            setEstadoProyecto('');
            setDescripcion('');
            setFechaInicio(''); 
            setFechaFin('');
            setHistorial([]);
            console.log('Proyecto registrado correctamente');
        } catch (error) {
            console.error('Error al registrar el proyecto:', error);
        }
    };


    return (
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Crear Proyecto</h1>
                </div>
                <form className='cproye' onSubmit={storeProyect}>
                    <div>
                    <h2>Nuevo Proyecto</h2>
                    <br/>
                    <label htmlFor="nombreProyecto">Nombre del Proyecto:</label>
                    <input type="text" id="nombreProyecto" name="nombreProyecto" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} placeholder="Proyecto Phoenix" required />
                    <label htmlFor="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="El Proyecto Phoenix es una iniciativa..." required />
                    <label htmlFor="recursos">Recursos:</label>
                    <input type="text" id="recursos" name="recursos" value={recursos} onChange={(e) => setRecursos(e.target.value)} placeholder="Cuatro computadoras, una impreso..." required />
                    <label htmlFor="presupuesto">Presupuesto:</label>
                    <input type="text" id="presupuesto" name="presupuesto" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="₡ 5.000.000" required />
                    <label htmlFor="estadoProyecto">Estado del Proyecto:</label>
                    <select id="estadoProyecto" className='laselecta' name="estadoProyecto" value={estadoProyecto} onChange={(e) => setEstadoProyecto(e.target.value)} required>
                        <option value="" disabled>Seleccionar estado del proyecto</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                    <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                    <input type="text" id="fechaInicio" name="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} placeholder="01/01/2024" required/>
                    <label htmlFor="fechaFin">Fecha de Fin:</label>
                    <input type="text" id="fechaFin" name="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} placeholder="31/12/2024" required/>
                    <label htmlFor="historial">Historial:</label>
                    <input type="text" id="historial" name="historial" value={historial} onChange={(e) => setHistorial(e.target.value)} placeholder="Se incorporó una nueva tarea al Pr..." readOnly/>

                    </div>
                    <div>
                        
                        {tareas.map((tarea, index) => (
                            <div class='scrollbox' key={index}>
                                <div class='scrollbox-inner'>
                                <h2>Tarea nº{index + 1}: </h2>
                                <br/>
                                <label htmlFor="nombreTarea">Nombre de la Tarea:</label>
                                    <input type="text" value={tarea.nombreTarea} onChange={(e) => actualizarTarea(index, 'nombreTarea', e.target.value)} placeholder="Tarea Horizon" required />
                                    <label htmlFor="estado">Estado:</label>
                                    <select className='laselecta' value={tarea.estado} onChange={(e) => actualizarTarea(index, 'estado', e.target.value)} required>
                                        <option value="" disabled>Seleccionar estado de la tarea</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                    <label htmlFor="storypoints">Story points:</label>
                                    <input type="number" value={tarea.storypoints} onChange={(e) => actualizarTarea(index, 'storypoints', e.target.value)} required />
                                    <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                    <input type="text" value={tarea.fechaInicio} onChange={(e) => actualizarTarea(index, 'fechaInicio', e.target.value)} placeholder="01/01/2024" required />
                                    <label htmlFor="fechaFin">Fecha de Fin:</label>
                                    <input type="text" value={tarea.fechaFin} onChange={(e) => actualizarTarea(index, 'fechaFin', e.target.value)} placeholder="31/12/2024" required />
                                </div>
                                <button className='cpback' type="button" onClick={deshacerTarea}>Deshacer</button>
                                {index !== tareas.length - 1 && <><hr/><br/></>}
                            </div>
                        ))}
                        <br/>
                        <button className='cpboton' type="button" onClick={agregarTarea}>Agregar Tarea</button>
                        <br/>
                        <br/>
                        <hr/>
                        <br/>
                        <br/>
                        <button className='cpboton' type="submit" onClick={storeProyect}>Guardar Proyecto</button>
                        <br />
                        <br />
                        <Link className='cpback2' type="button" to="/gestionProyectos">Regresar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CrearProyecto;
