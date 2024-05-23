import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/ModificarProyecto.css';



function ModificarProyecto() {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [proyecto, setProyecto] = useState(null);
    const [proyectoNoEncontrado, setProyectoNoEncontrado] = useState(false);
    const [colaboradoresProyecto, setColaboradoresProyecto] = useState([]);
    const [nuevoNombreTarea, setNuevoNombreTarea] = useState('');
    const [mapeoColaboradores, setMapeoColaboradores] = useState([]);
    const mailCollection = collection(db, 'mail');

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

    useEffect(() => {
        const fetchData = async () => {
            if (colaboradoresProyecto.length !== 0) {
                const colaboradoresCollection = collection(db, 'colaboradores');
                const colaboradoresData = [];
    
                
                for (const nombreColaborador of colaboradoresProyecto) {
                  
                    const colaboradorQuery = query(colaboradoresCollection, where('nombre', '==', nombreColaborador));
                    const querySnapshot = await getDocs(colaboradorQuery);
                    
                   
                    if (!querySnapshot.empty) {
                        
                        const colaboradorData = querySnapshot.docs[0].data();
                        colaboradoresData.push(colaboradorData);
                    } else {
                        console.log(`No se encontró el colaborador con el nombre: ${nombreColaborador}`);
                        
                    }
                }
                setMapeoColaboradores(colaboradoresData);
            }
        };
    
        fetchData();
    }, [colaboradoresProyecto]);

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

        const toEmails = mapeoColaboradores.map(colaborador => colaborador.correo);

        if (!proyecto) {
            return;
        }
        try {
            const proyectoDocRef = doc(db, "proyecto", proyecto.id);
            const newData = {
                tareas: proyecto.tareas,
                historial: proyecto.historial
            };
            await updateDoc(proyectoDocRef, newData);
            alert("¡Se actualizó el proyecto!");
            console.log("¡Se actualizó el proyecto!");

            await addDoc(mailCollection, {
                to: toEmails,
                message: {
                    subject: `Se modificó el proyecto: ${proyectoSeleccionado}`,
                    text: `Se modificó el proyecto: ${proyectoSeleccionado}`,
                    html: `<p> Se modificó el proyecto: ${proyectoSeleccionado}</p>`
                }
            })

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

        const tareaAgregada = `Se agregó: ${nuevoNombreTarea}`;
        const nuevoHistorial = [...(proyecto.historial || []), tareaAgregada];

        setProyecto(prevProyecto => ({
            ...prevProyecto,
            tareas: [...(prevProyecto.tareas || []), nuevaTarea],
            historial: nuevoHistorial
        }));

        setNuevoNombreTarea('');
    };

    const handleModificarTarea = (index, nuevoNombre, nuevaDescripcion, nuevoResponsable, nuevoStoryPoints, nuevaFechaInicio, nuevaFechaFin) => {
        const nuevasTareas = [...proyecto.tareas];
        const tareaModificada = nuevasTareas[index];

        nuevasTareas[index] = {
            ...tareaModificada,
            nombreTarea: nuevoNombre,
            descripcion: nuevaDescripcion,
            responsable: nuevoResponsable,
            storypoints: nuevoStoryPoints,
            fechaInicio: nuevaFechaInicio,
            fechaFin: nuevaFechaFin
        };

        const tareaModificadaMensaje = ` Se modificó: ${nuevoNombre}`;

        setProyecto(prevProyecto => ({
            ...prevProyecto,
            tareas: nuevasTareas,
            historial: [...prevProyecto.historial, tareaModificadaMensaje]
        }));
    };

    const handleEstadoChange = (index, nuevoEstado) => {
        const nuevasTareas = [...proyecto.tareas];
        nuevasTareas[index].estado = nuevoEstado;
        setProyecto({ ...proyecto, tareas: nuevasTareas });
    };

    const handleEliminarTarea = (index) => {
        const nombreTareaEliminada = proyecto.tareas[index].nombreTarea;
        const nuevasTareas = proyecto.tareas.filter((_, i) => i !== index);
        const tareaEliminadaMensaje = ` Se eliminó: ${nombreTareaEliminada}`;
        const nuevoHistorial = [...(proyecto.historial || []), tareaEliminadaMensaje];
        
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
                    <select className='laselecta' id="proyecto" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
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
                                                <br/>
                                                <h2>Tarea nº{index + 1}: </h2>
                                                <br/>
                                                <label htmlFor={`nombreTarea-${index}`}>Nombre de la Tarea:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Tarea Horizon"
                                                    value={tarea.nombreTarea}
                                                    onChange={(e) => handleModificarTarea(index, e.target.value, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}
                                                    id={`nombreTarea-${index}`}
                                                />
                                                <label htmlFor={`descripcion-${index}`}>Descripción:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.descripcion}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, e.target.value, tarea.responsable, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}
                                                    id={`descripcion-${index}`}
                                                />
                                                <label htmlFor={`estado-${index}`}>Estado:</label>
                                                <select
                                                    className='laselecta'
                                                    value={tarea.estado}
                                                    onChange={(e) => handleEstadoChange(index, e.target.value)}
                                                    id={`estado-${index}`}
                                                >
                                                    <option value="Por Hacer">Por Hacer</option>
                                                    <option value="En Progreso">En Progreso</option>
                                                    <option value="Completada">Completada</option>
                                                </select>
                                                <div>
                                                    <label htmlFor={`responsable-${index}`}>Responsable:</label>
                                                    <select
                                                        className='laselecta'
                                                        value={tarea.responsable}
                                                        onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, e.target.value, tarea.storypoints, tarea.fechaInicio, tarea.fechaFin)}
                                                        id={`responsable-${index}`}
                                                    >
                                                        <option value="">Seleccionar</option>
                                                        {colaboradoresProyecto.map((colaborador, index) => (
                                                            <option key={index} value={colaborador}>{colaborador}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label htmlFor={`storypoints-${index}`}>Story Points:</label>
                                                <input
                                                    type="number"
                                                    value={tarea.storypoints}
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, e.target.value, tarea.fechaInicio, tarea.fechaFin)}
                                                    id={`storypoints-${index}`}
                                                />
                                                <label htmlFor={`fechaInicio-${index}`}>Fecha de Inicio:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaInicio}
                                                    placeholder='01/01/2024'
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, e.target.value, tarea.fechaFin)}
                                                    id={`fechaInicio-${index}`}
                                                />
                                                <label htmlFor={`fechaFin-${index}`}>Fecha de Fin:</label>
                                                <input
                                                    type="text"
                                                    value={tarea.fechaFin}
                                                    placeholder='31/12/2024'
                                                    onChange={(e) => handleModificarTarea(index, tarea.nombreTarea, tarea.descripcion, tarea.responsable, tarea.storypoints, tarea.fechaInicio, e.target.value)}
                                                    id={`fechaFin-${index}`}
                                                />
                                            </div>
                                            <button className='back' onClick={() => handleEliminarTarea(index)}>Eliminar Tarea</button>
                                            <br />
                                            {index !== proyecto.tareas.length - 1 && <hr /> }
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <hr />
                            <br />
                            <input
                                type="text"
                                placeholder="Nombre de la Tarea"
                                value={nuevoNombreTarea}
                                onChange={(e) => setNuevoNombreTarea(e.target.value)}
                            />
                            <br />
                            <br />
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