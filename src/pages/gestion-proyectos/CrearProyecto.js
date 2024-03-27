import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importar los estilos de react-datepicker
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

function CrearProyecto() {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [recursos, setRecursos] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const [colaboradores, setColaboradores] = useState('');
    const [tareas, setTareas] = useState([]);
    const [estadoProyecto, setEstadoProyecto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState(null); // Cambiado a null para iniciar sin fecha seleccionada
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
            responsable: '',
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
                colaboradores: colaboradores ? colaboradores.split(',').map(c => c.trim()) : [],
                tareas: tareas,
                estadoProyecto: estadoProyecto,
                descripcion: descripcion,
                fechaInicio: fechaInicio, // Cambiado a fechaInicio
                historial: historial
            });
            alert('Proyecto registrado correctamente');
            setNombreProyecto('');
            setRecursos('');
            setPresupuesto('');
            setColaboradores('');
            setTareas([]);
            setEstadoProyecto('');
            setDescripcion('');
            setFechaInicio(null); // Cambiado a null
            setHistorial('');


            console.log('Proyecto registrado correctamente');
            // Resto del código...

        } catch (error) {
            console.error('Error al registrar el proyecto:', error);
        }
    };

    return (
        <div>
            <h1>Crear Proyecto</h1>
            {}
            <form onSubmit={storeProyect}>
                <div>
                    <input type="text" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} placeholder="Nombre del Proyecto" required />
                    <input type="text" value={recursos} onChange={(e) => setRecursos(e.target.value)} placeholder="Recursos" required />
                    <input type="text" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Presupuesto" required />
                    <input type="text" value={colaboradores} onChange={(e) => setColaboradores(e.target.value)} placeholder="Colaboradores (separados por comas)" required />
                    <select value={estadoProyecto} onChange={(e) => setEstadoProyecto(e.target.value)} required>
                        <option value="" disabled>Seleccionar estado del proyecto</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                    <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" required/>
                    <DatePicker selected={fechaInicio} onChange={(date) => setFechaInicio(date)} placeholderText="Fecha de Inicio" required /> {/* Cambiado a DatePicker */}
                    <input type="text" value={historial} onChange={(e) => setHistorial(e.target.value)} placeholder="Historial" required/>
                </div>
                <div>
                    <h2>Tareas:</h2>
                    {tareas.map((tarea, index) => (
                        <div key={index}>
                            <input type="text" value={tarea.nombreTarea} onChange={(e) => actualizarTarea(index, 'nombreTarea', e.target.value)} placeholder="Nombre de la Tarea" required />
                            
                            <select value={tarea.estado} onChange={(e) => actualizarTarea(index, 'estado', e.target.value)} required>
                                <option value="" disabled>Seleccionar estado de la tarea</option>
                                <option value="En progreso">En progreso</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                    
                            <input type="text" value={tarea.responsable} onChange={(e) => actualizarTarea(index, 'responsable', e.target.value)} placeholder="Responsable" required />
                            <input type="number" value={tarea.storypoints} onChange={(e) => actualizarTarea(index, 'storypoints', e.target.value)} placeholder="Story Points" required />
                            <DatePicker selected={tarea.fechaInicio} onChange={(date) => actualizarTarea(index, 'fechaInicio', date)} placeholderText="Fecha de Inicio" required /> {/* Cambiado a DatePicker */}
                            <DatePicker selected={tarea.fechaFin} onChange={(date) => actualizarTarea(index, 'fechaFin', date)} placeholderText="Fecha de Fin" required /> {/* Cambiado a DatePicker */}
                        </div>
                    ))}
                    <button type="button" onClick={agregarTarea}>Agregar Tarea</button>
                    <button type="button" onClick={deshacerTarea}>Deshacer</button>
                </div>
                <div>
                    <button type="submit">Guardar Proyecto</button>
                </div>
            </form>
            <Link to="/gestionProyectos">
            <button>Salir</button>
            </Link>
        </div>
    );
}

export default CrearProyecto;
