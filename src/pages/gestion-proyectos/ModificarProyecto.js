import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function ModificarProyecto() {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [proyectoNoEncontrado, setProyectoNoEncontrado] = useState(false);
    const [colaboradoresProyecto, setColaboradoresProyecto] = useState([]);

    useEffect(() => {
        const obtenerColaboradoresProyecto = async () => {
            if (proyecto && proyecto.colaboradores) {
                setColaboradoresProyecto(proyecto.colaboradores);
            }
        };

        obtenerColaboradoresProyecto();
    }, [proyecto]);

    const searchProyecto = async () => {
        const proyectosCollection = collection(db, 'proyecto');
        const q = query(proyectosCollection, where('nombreProyecto', '==', nombreProyecto));

        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            const proyectoDoc = querySnapshot.docs[0];
            setProyecto({
                id: proyectoDoc.id,
                ...proyectoDoc.data()
            });
            setProyectoNoEncontrado(false);
        } else {
            setProyectoNoEncontrado(true);
            setTimeout(() => {
                setProyectoNoEncontrado(false);
            }, 3000);
        }
    }

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
        nuevasTareas[index].nombreTarea = nuevoNombre;
        nuevasTareas[index].descripcion = nuevaDescripcion;
        nuevasTareas[index].responsable = nuevoResponsable;
        nuevasTareas[index].storypoints = nuevoStoryPoints;
        nuevasTareas[index].fechaInicio = nuevaFechaInicio;
        nuevasTareas[index].fechaFin = nuevaFechaFin;
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
            <label htmlFor="nombreProyecto">Nombre del Proyecto:</label>
            <input type="text" id="nombreProyecto" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} />
            <button onClick={searchProyecto}>Buscar Proyecto</button>

            {proyectoNoEncontrado && <p>No se encontró el proyecto.</p>}

            {proyecto && (
                <>
                    <h2>Tareas del Proyecto:</h2>
                    <ul>
                        {proyecto.tareas.map((tarea, index) => (
                            <div key={index}>
                                <div>
                                    <p>Nombre de Tarea: {tarea.nombreTarea}</p>
                                    <p>Descripción: {tarea.descripcion}</p>
                                    <p>Estado: {tarea.estado}</p>
                                    <div>
                                    <p>Responsable:</p>
                                    <select value={tarea.responsable} onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, e.target.value, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}>
                                        <option value="">Seleccionar</option>
                                        {colaboradoresProyecto.map((colaborador, index) => (
                                            <option key={index} value={colaborador}>{colaborador}</option>
                                        ))}
                                    </select>
                                    </div>
                                </div>
                                <br>
                                </br>
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
