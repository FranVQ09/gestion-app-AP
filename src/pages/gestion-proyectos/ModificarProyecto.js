import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function ModificarProyecto() {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [proyectoNoEncontrado, setProyectoNoEncontrado] = useState(false);
    const [colaboradoresProyecto, setColaboradoresProyecto] = useState([]);
    const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState('');

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
                tareas: proyecto.tareas
            };
            await updateDoc(proyectoDocRef, newData);
            alert("Se actualizó el proyecto!");
            console.log("Se actualizó el proyecto!");
        } catch (error) {
            console.error("Error, no se actualizó: ", error);
        }
    }

    const agregarTarea = () => {
        const nuevaTarea = {
            nombreTarea: '',
            descripcion: '',
            estado: 'Por Hacer',
            responsable: '',
            storypoints: 0,
            fechaInicio: '',
            fechaFin: ''
        };
        setProyecto({
            ...proyecto,
            tareas: [...proyecto.tareas, nuevaTarea]
        });
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
        const nuevasTareas = proyecto.tareas.filter((_, i) => i !== index);
        setProyecto({ ...proyecto, tareas: nuevasTareas });
    };

    return (
        <div>
            <h1>Modificar Proyecto</h1>
            <label htmlFor="proyecto">Seleccione un Proyecto:</label>
            <select id="proyecto" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
                <option value="">Seleccione un proyecto</option>
                {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
                ))}
            </select>
            <button onClick={searchProyecto}>Buscar Proyecto</button>
            {proyectoNoEncontrado && <p>No se encontró el proyecto.</p>}

            {proyecto && (
                <>
                    <h2>Tareas del Proyecto:</h2>
                    <ul>
                        {proyecto.tareas.map((tarea, index) => (
                            <div key={index}>
                                <div>
                                    <p>Nombre de Tarea:</p>
                                    <input 
                                        type="text" 
                                        value={tarea.nombreTarea} 
                                        onChange={(e) => handleModificarTarea(index, e.target.value, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} 
                                    />
                                    <p>Descripción:</p>
                                    <input 
                                        type="text" 
                                        value={tarea.descripcion} 
                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, e.target.value, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} 
                                    />
                                    <p>Estado:
                                        <select 
                                            value={tarea.estado} 
                                            onChange={(e) => handleEstadoChange(index, e.target.value)}>
                                            <option value="Por Hacer">Por Hacer</option>
                                            <option value="En Progreso">En Progreso</option>
                                            <option value="Completada">Completada</option>
                                        </select>
                                    </p>
                                    <div>
                                        <p>Responsable:</p>
                                        <select 
                                            value={tarea.responsable} 
                                            onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, e.target.value, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)} 
                                        >
                                            <option value="">Seleccionar</option>
                                            {colaboradoresProyecto.map((colaborador, index) => (
                                                <option key={index} value={colaborador}>{colaborador}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p>Story Points:</p>
                                    <input 
                                        type="number" 
                                        value={tarea.storypoints} 
                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, e.target.value, tarea.fechaInicio, tarea.fechaFin)} 
                                    />
                                    <p>Fecha de Inicio:</p>
                                    <input 
                                        type="text" 
                                        value={tarea.fechaInicio} 
                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, e.target.value, tarea.fechaFin)} 
                                    />
                                    <p>Fecha de Fin:</p>
                                    <input 
                                        type="text" 
                                        value={tarea.fechaFin} 
                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, e.target.value)} 
                                    />
                                </div>
                                <br />
                                <button onClick={() => handleEliminarTarea(index)}>Eliminar Tarea</button>
                                {index !== proyecto.tareas.length - 1 && <hr />}
                            </div>
                        ))}
                    </ul>
                    <button onClick={agregarTarea}>Agregar Tarea</button>
                    <button onClick={updateProyecto}>Guardar Cambios</button>
                </>
            )}

            <Link to="/gestionProyectos">
                <button>Salir</button>
            </Link>
        </div>
    )
}

export default ModificarProyecto;
