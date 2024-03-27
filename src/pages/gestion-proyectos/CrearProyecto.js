import React, { useState } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

function CrearProyecto() {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [recursos, setRecursos] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const [colaboradores, setColaboradores] = useState('');
    const [tareas, setTareas] = useState('');
    const [estadoProyecto, setEstadoProyecto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [historial, setHistorial] = useState('');

    const proyectosCollection = collection(db, 'proyecto');

    const storeProyect = async (e) => {
        e.preventDefault();

        try {
            // Convertir el campo colaboradores en un array si no está vacío
            const colaboradoresArray = colaboradores ? colaboradores.split(',').map(c => c.trim()) : [];

            await addDoc(proyectosCollection, { 
                nombreProyecto: nombreProyecto,
                recursos: recursos,
                presupuesto: presupuesto,
                colaboradores: colaboradoresArray, // Usar el array de colaboradores
                tareas: tareas,
                estadoProyecto: estadoProyecto,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
                historial: historial
            });

            console.log('Proyecto registrado correctamente');
            // Resto del código...

        } catch (error) {
            console.error('Error al registrar el proyecto:', error);
        }
    };

    return (
        <div>
            <h1>Crear Proyecto</h1>
            <form onSubmit={storeProyect}>
                <input type="text" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} placeholder="Nombre del Proyecto" />
                <input type="text" value={recursos} onChange={(e) => setRecursos(e.target.value)} placeholder="Recursos" />
                <input type="text" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Presupuesto" />
                <input type="text" value={colaboradores} onChange={(e) => setColaboradores(e.target.value)} placeholder="Colaboradores (separados por comas)" />
                <input type="text" value={tareas} onChange={(e) => setTareas(e.target.value)} placeholder="Tareas" />
                
                <select value={estadoProyecto} onChange={(e) => setEstadoProyecto(e.target.value)}>
                    <option value="" disabled>Seleccionar estado del proyecto</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
                
                <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
                <input type="text" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} placeholder="Fecha de Inicio" />
                <input type="text" value={historial} onChange={(e) => setHistorial(e.target.value)} placeholder="Historial" />
                <button type="submit">Guardar Proyecto</button>
            </form>
        </div>
    );
}

export default CrearProyecto;
