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
            alert("¡Se actualizó el proyecto!");
            console.log("¡Se actualizó el proyecto!");
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
            tareas: [...(proyecto.tareas || []), nuevaTarea]
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
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Modificación de Proyecto</h1>
                </div>
                <form className='mproye'>
                    <label htmlFor="proyecto">Seleccione un Proyecto:</label>
                    <select id="proyecto" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
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
                                                <label htmlFor="nombredelatarea">Nombre de la Tarea:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.nombreTarea}
                                                    onChange={(e) => handleModificarTarea(index, e.target.value, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}
                                                />
                                                <label htmlFor="descripcion">Descripción:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.descripcion}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, e.target.value, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}
                                                />
                                                <label htmlFor="estado">Estado:</label>
                                                <select
                                                    value={tarea.estado}
                                                    onChange={(e) => handleEstadoChange(index, e.target.value)}>
                                                    <option value="Por Hacer">Por Hacer</option>
                                                    <option value="En Progreso">En Progreso</option>
                                                    <option value="Completada">Completada</option>
                                                </select>
                                                <div>
                                                    <label htmlFor="responsable">Responsable:</label>
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
                                                <label htmlFor="storypoints">Story Points:</label>
                                                <input
                                                    type="number"
                                                    value={tarea.storypoints}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, e.target.value, tarea.fechaInicio, tarea.fechaFin)}
                                                />
                                                <label htmlFor="storypoints">Fecha de Inicio:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaInicio}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, e.target.value, tarea.fechaFin)}
                                                />
                                                <label htmlFor="storypoints">Fecha de Fin:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaFin}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, e.target.value)}
                                                />
                                            </div>
                                            <br />
                                            <button className='boton' onClick={agregarTarea}>Agregar Tarea</button>
                                            <button className='back' onClick={() => handleEliminarTarea(index)}>Eliminar Tarea</button>
                                            {index !== proyecto.tareas.length - 1 && <hr />}
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <button className='boton' type="button" onClick={updateProyecto}>Guardar Cambios</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ModificarProyecto;
