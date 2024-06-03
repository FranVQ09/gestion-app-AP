// src/pages/gestion-proyectos/Informes.js
import React, { useEffect, useState } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';
import {
    generateProjectPDFReport,
    generateProjectCSVReport,
    generateProjectXMLReport,
    generateAllProjectsPDFReport,
    generateAllProjectsCSVReport,
    generateAllProjectsXMLReport
} from '../../utils/reportUtils';

function Informes() {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
    const [idiomaSeleccionado, setIdiomaSeleccionado] = useState('es');

    useEffect(() => {
        console.log("Fetching proyectos...");
        const obtenerProyectos = async () => {
            const proyectosCollection = collection(db, 'proyecto');
            const querySnapshot = await getDocs(proyectosCollection);
            const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProyectos(proyectosData);
            console.log("Proyectos fetched: ", proyectosData);
        };

        obtenerProyectos();
    }, []);

    const handleGenerateReport = async (format) => {
        if (!proyectoSeleccionado) {
            alert('Por favor, seleccione un proyecto');
            return;
        }

        try {
            const proyecto = proyectos.find(proy => proy.nombreProyecto === proyectoSeleccionado);
            if (!proyecto) {
                alert('Proyecto no encontrado');
                return;
            }
            console.log(`Generando informe ${format.toUpperCase()} para el proyecto ${proyectoSeleccionado} en ${idiomaSeleccionado}...`);
            switch (format) {
                case 'pdf':
                    await generateProjectPDFReport(proyecto, proyectoSeleccionado, idiomaSeleccionado);
                    break;
                case 'csv':
                    await generateProjectCSVReport(proyecto, proyectoSeleccionado, idiomaSeleccionado);
                    break;
                case 'xml':
                    await generateProjectXMLReport(proyecto, proyectoSeleccionado, idiomaSeleccionado);
                    break;
                default:
                    console.error("Formato no soportado:", format);
            }
        } catch (error) {
            console.error("Error generando el informe: ", error);
        }
    };

    const handleGenerateAllReports = async (format) => {
        console.log(`Generando informe general ${format.toUpperCase()} en ${idiomaSeleccionado}...`);
        switch (format) {
            case 'pdf':
                await generateAllProjectsPDFReport(proyectos, idiomaSeleccionado);
                break;
            case 'csv':
                await generateAllProjectsCSVReport(proyectos, idiomaSeleccionado);
                break;
            case 'xml':
                await generateAllProjectsXMLReport(proyectos, idiomaSeleccionado);
                break;
            default:
                console.error("Formato no soportado:", format);
        }
    };

    return (
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Informes del Proyecto</h1>
                </div>
                <form className='infoProye'>
                    <label htmlFor="proyecto">Seleccione un Proyecto:</label>
                    <select className='laselecta' id="proyecto" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
                        <option value="">Seleccione un proyecto</option>
                        {proyectos.map(proyecto => (
                            <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
                        ))}
                    </select>
                    <label htmlFor="idioma">Seleccione un Idioma:</label>
                    <select className='laselecta' id="idioma" value={idiomaSeleccionado} onChange={(e) => setIdiomaSeleccionado(e.target.value)}>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        <option value="hi">हिंदी</option>
                        <option value="ar">العربية</option>
                        <option value="pt">Português</option>
                        <option value="fr">Français</option>
                        <option value="ru">Русский</option>
                        <option value="ja">日本語</option>
                        <option value="de">Deutsch</option>
                    </select>
                    <br></br>
                    <label>Informes proyectos específicos:</label>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('pdf')}>Generar Informe PDF</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('csv')}>Generar Informe CSV</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('xml')}>Generar Informe XML</button>
                    <br></br>
                    <label>Informes para todos los proyectos:</label>
                    <button className='boton' type="button" onClick={() => handleGenerateAllReports('pdf')}>Generar Informe General PDF</button>
                    <button className='boton' type="button" onClick={() => handleGenerateAllReports('csv')}>Generar Informe General CSV</button>
                    <button className='boton' type="button" onClick={() => handleGenerateAllReports('xml')}>Generar Informe General XML</button>
                    <Link className='back' to="/gestionProyectos">Regresar</Link>
                </form>
            </div>
        </div>
    );
}

export default Informes;
