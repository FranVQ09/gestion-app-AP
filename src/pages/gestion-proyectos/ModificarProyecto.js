import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/ModificarProyecto.css';

function ModificarProyecto() {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [proyectoNoEncontrado, setProyectoNoEncontrado] = useState(false);
    const [colaboradoresProyecto, setColaboradoresProyecto] = useState([]);
    const [nuevoNombreTarea, setNuevoNombreTarea] = useState(''); // Estado para el nombre de la nueva tarea

    useEffect(() => {
        const obtenerProyectos = async () => {
            const proyectosCollection = collection(db, 'proyecto');
            const querySnapshot = await getDocs(proyectosCollection);
            const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProyectos(proyectosData);
        };

        obtenerProyectos();
    }, []);

    useEffect(() => {
        if (proyecto) {
            setColaboradoresProyecto(proyecto.colaboradores || []);
        }
    }, [proyecto]);

    const searchProyecto = async () => {
        if (!proyectoSeleccionado) return;

        const proyectoEncontrado = proyectos.find(proyecto => proyecto.nombreProyecto === proyectoSeleccionado);
        if (proyectoEncontrado) {
            setProyecto(proyectoEncontrado);
            setProyectoNoEncontrado(false);
        } else {
            setProyecto(null);
            setProyectoNoEncontrado(true);
            setTimeout(() => {
                setProyectoNoEncontrado(false);
            }, 3000);
        }
    };

    const updateProyecto = async () => {
        if (!proyecto) {
            return;
        }
        try {
            const proyectoDocRef = doc(db, "proyecto", proyecto.id);
            const newData = {
                tareas: proyecto.tareas,
                historial: proyecto.historial // Se mantiene el historial actualizado en el proyecto
            };
            await updateDoc(proyectoDocRef, newData);
            alert("¡Se actualizó el proyecto!");
            console.log("¡Se actualizó el proyecto!");
        } catch (error) {
            console.error("Error, no se actualizó: ", error);
        }
    };

    const agregarTarea = () => {
        if (!nuevoNombreTarea.trim()) {
            alert("Por favor, ingresa un nombre válido para la tarea.");
            return;
        }

        const nuevaTarea = {
            nombreTarea: nuevoNombreTarea,
            descripcion: '',
            estado: 'Por Hacer',
            responsable: '',
            storypoints: 0,
            fechaInicio: '',
            fechaFin: ''
        };

        // Crear el mensaje para el historial
        const tareaAgregada = `Se agregó: ${nuevoNombreTarea}`;

        // Crear el nuevo historial que incluye el mensaje de la tarea agregada
        const nuevoHistorial = [...(proyecto.historial || []), tareaAgregada];

        // Actualizar el estado del proyecto con la nueva tarea y el historial actualizado
        setProyecto(prevProyecto => ({
            ...prevProyecto,
            tareas: [...(prevProyecto.tareas || []), nuevaTarea],
            historial: nuevoHistorial
        }));

        // Limpiar el estado del nombre de la tarea
        setNuevoNombreTarea('');
    };

    const handleModificarTarea = (index, nuevoNombre, nuevaDescripcion, nuevoResponsable, nuevoStoryPoints, nuevaFechaInicio, nuevaFechaFin) => {
        const nuevasTareas = [...proyecto.tareas];
        nuevasTareas[index] = {
            ...nuevasTareas[index],
            nombreTarea: nuevoNombre,
            descripcion: nuevaDescripcion,
            responsable: nuevoResponsable,
            storypoints: nuevoStoryPoints,
            fechaInicio: nuevaFechaInicio,
            fechaFin: nuevaFechaFin
        };
        setProyecto({ ...proyecto, tareas: nuevasTareas });
    };

    const handleEstadoChange = (index, nuevoEstado) => {
        const nuevasTareas = [...proyecto.tareas];
        nuevasTareas[index].estado = nuevoEstado;
        setProyecto({ ...proyecto, tareas: nuevasTareas });
    };

    const handleEliminarTarea = (index) => {
        // Obtener el nombre de la tarea que se va a eliminar
        const nombreTareaEliminada = proyecto.tareas[index].nombreTarea;
        
        // Filtrar las tareas para eliminar la tarea en el índice dado
        const nuevasTareas = proyecto.tareas.filter((_, i) => i !== index);
        
        // Actualizar el historial con el mensaje de la tarea eliminada
        const tareaEliminadaMensaje = `Se eliminó: ${nombreTareaEliminada}`;
        const nuevoHistorial = [...(proyecto.historial || []), tareaEliminadaMensaje];
        
        // Actualizar el estado del proyecto con las tareas actualizadas y el nuevo historial
        setProyecto({ ...proyecto, tareas: nuevasTareas, historial: nuevoHistorial });
    };

    return (
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Modificación de Proyecto</h1>
                </div>
                <form className='mproye'>
                    <label htmlFor="proyecto">Seleccione un Proyecto:</label>
                    <select id="proyecto" className='laselecta' value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
                        <option value="">Seleccione un proyecto</option>
                        {proyectos.map(proyecto => (
                            <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
                        ))}
                    </select>
                    <button className='boton' type="button" onClick={searchProyecto}>Buscar Proyecto</button>
                    <Link className='back' to="/gestionProyectos">Regresar</Link>
                </form>
                {proyectoNoEncontrado && <p>No se encontró el proyecto.</p>}

                {proyecto && (
                    <form className='mproye2'>
                        <div className='scrollbox'>
                            <div className='scrollbox-inner'>
                                <ul>
                                    {proyecto.tareas.map((tarea, index) => (
                                        <div key={index}>
                                            <div>
                                            <h2>Tarea nº{index + 1}: </h2>
                                            <br/>
                                                <label htmlFor="nombredelatarea">Nombre de la tarea:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.nombreTarea}
                                                    onChange={(e) => handleModificarTarea(index, e.target.value, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} placeholder="Tarea Horizon"
                                                />
                                                <label htmlFor="descripcion">Descripción:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.descripcion}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, e.target.value, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} placeholder="Desarrolo de la interfaz de usuario..."
                                                />
                                                <label htmlFor="estado">Estado:</label>
                                                <select
                                                    value={tarea.estado}
                                                    className='laselecta'
                                                    onChange={(e) => handleEstadoChange(index, e.target.value)}> 
                                                    <option value="Por Hacer">Por Hacer</option>
                                                    <option value="En Progreso">En Progreso</option>
                                                    <option value="Completada">Completada</option>
                                                </select>
                                                <div>
                                                    <label htmlFor="responsable">Responsable:</label>
                                                    <select
                                                        value={tarea.responsable}
                                                        className='laselecta'
                                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, e.target.value, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} 
                                                    >
                                                        <option value="">Seleccione un responsable</option>
                                                        {colaboradoresProyecto.map((colaborador, index) => (
                                                            <option key={index} value={colaborador}>{colaborador}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label htmlFor="storypoints">Story Points:</label>
                                                <input
                                                    type="number"
                                                    value={tarea.storypoints}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, e.target.value, tarea.fechaInicio, tarea.fechaFin)}
                                                />
                                                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaInicio}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, e.target.value, tarea.fechaFin)} placeholder="01/01/24"
                                                />
                                                <label htmlFor="fechaFin">Fecha de Fin:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaFin}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, e.target.value)} placeholder="31/12/24"
                                                />
                                            </div>
                                            <button className='back' onClick={() => handleEliminarTarea(index)}>Eliminar Tarea</button>
                                            <br />
                                            {index !== proyecto.tareas.length - 1 && <hr /> }
                                            <br />
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <button className='boton' type="button" onClick={agregarTarea}>Agregar Tarea</button>
                            <br />
                            <hr />
                            <br />
                            <br />
                            <button className='boton' type="button" onClick={updateProyecto}>Guardar Cambios</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ModificarProyecto;
