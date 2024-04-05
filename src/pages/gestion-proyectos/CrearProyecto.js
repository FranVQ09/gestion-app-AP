import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css'; // Importar los estilos de react-datepicker
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import '../../styles/CrearProyecto.css';  


function CrearProyecto() {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [recursos, setRecursos] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const [tareas, setTareas] = useState([]);
    const [estadoProyecto, setEstadoProyecto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState(null); // Cambiado a null para iniciar sin fecha seleccionada
    const [fechaFin, setFechaFin] = useState(null); // Cambiado a null para iniciar sin fecha seleccionada
    const [historial, setHistorial] = useState('');

    const proyectosCollection = collection(db, 'proyecto');

    const agregarTarea = () => {
        // Verificar si todos los campos de la nueva tarea están en blanco
        const nuevaTareaVacia = tareas.some(tarea => Object.values(tarea).every(value => value === ''));
        if (nuevaTareaVacia) {
            alert('Por favor, complete todos los campos de la nueva tarea antes de agregarla.');
            return;
        }

        // Agregar la nueva tarea al estado tareas
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
        // Verificar si hay al menos una tarea para deshacer
        if (tareas.length === 0) {
            alert('No hay tareas para deshacer.');
            return;
        }

        // Eliminar la última tarea agregada del estado tareas
        const nuevasTareas = [...tareas];
        nuevasTareas.pop(); // Eliminar el último elemento del array
        setTareas(nuevasTareas);
    };

    const actualizarTarea = (index, campo, valor) => {
        const nuevasTareas = [...tareas];
        nuevasTareas[index][campo] = valor;
        setTareas(nuevasTareas);
    };

    const storeProyect = async (e) => {
        e.preventDefault();

        // Verificar si todas las tareas tienen al menos un campo no vacío
        const tareasValidas = tareas.every(tarea => Object.values(tarea).some(value => value !== ''));
        if (!tareasValidas) {
            alert('Por favor, complete todos los campos de las tareas antes de guardar el proyecto.');
            return;
        }

        try {
            await addDoc(proyectosCollection, { 
                nombreProyecto: nombreProyecto,
                recursos: recursos,
                presupuesto: presupuesto,
                tareas: tareas,
                estadoProyecto: estadoProyecto,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                historial: historial
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
            setHistorial('');

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
                    <label htmlFor="nombreProyecto">Nombre del Proyecto:</label>
                    <input type="text" id="nombreProyecto" name="nombreProyecto" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} placeholder="Nombre del Proyecto" required />
                    <label htmlFor="recursos">Recursos:</label>
                    <input type="text" id="recursos" name="recursos" value={recursos} onChange={(e) => setRecursos(e.target.value)} placeholder="Recursos" required />
                    <label htmlFor="presupuesto">Presupuesto:</label>
                    <input type="text" id="presupuesto" name="presupuesto" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Presupuesto" required />
                    <label htmlFor="estadoProyecto">Estado del Proyecto:</label>
                    <select id="estadoProyecto" name="estadoProyecto" value={estadoProyecto} onChange={(e) => setEstadoProyecto(e.target.value)} required>
                        <option value="" disabled>Seleccionar estado del proyecto</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                    <label htmlFor="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required/>
                    <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                    <input type="text" id="fechaInicio" name="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} placeholder="Fecha de Inicio" required/>
                    <label htmlFor="fechaFin">Fecha de Fin:</label>
                    <input type="text" id="fechaFin" name="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} placeholder="Fecha de Fin" required/>
                    <label htmlFor="historial">Historial:</label>
                    <input type="text" id="historial" name="historial" value={historial} onChange={(e) => setHistorial(e.target.value)} placeholder="Historial" required/>

                    </div>
                    <div>
                        
                        {tareas.map((tarea, index) => (
                            <div class='scrollbox' key={index}>
                                <div class='scrollbox-inner'>
                                <h2>Tarea nº{index + 1}: </h2>
                                <br/>
                                    <input type="text" value={tarea.nombreTarea} onChange={(e) => actualizarTarea(index, 'nombreTarea', e.target.value)} placeholder="Nombre de la Tarea" required />
                                    <select value={tarea.estado} onChange={(e) => actualizarTarea(index, 'estado', e.target.value)} required>
                                        <option value="" disabled>Seleccionar estado de la tarea</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                    <input type="number" value={tarea.storypoints} onChange={(e) => actualizarTarea(index, 'storypoints', e.target.value)} placeholder="Story Points" required />
                                    <input type="text" value={tarea.fechaInicio} onChange={(e) => actualizarTarea(index, 'fechaInicio', e.target.value)} placeholder="Fecha de Inicio" required />
                                    <input type="text" value={tarea.fechaFin} onChange={(e) => actualizarTarea(index, 'fechaFin', e.target.value)} placeholder="Fecha de Fin" required />
                                </div>
                                <button className='cpback' type="button" onClick={deshacerTarea}>Deshacer</button>
                                {index !== tareas.length - 1 && <><hr/><br/></>}
                            </div>
                        ))}
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
