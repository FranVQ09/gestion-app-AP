// src/pages/gestion-colaboradores/ReportesColaboradores.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';
import { Link } from 'react-router-dom';
import { generatePDFReport, generateCSVReport, generateXMLReport } from '../../utils/reportUtils';
import '../../styles/Informes.css';

function ReportesColaboradores() {
    const [colaboradores, setColaboradores] = useState([]);
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const fetchColaboradores = async () => {
            try {
                console.log("Fetching colaboradores...");
                const querySnapshot = await getDocs(collection(db, 'colaboradores'));
                const colaboradoresData = querySnapshot.docs.map(doc => doc.data());
                console.log("Colaboradores fetched: ", colaboradoresData);
                setColaboradores(colaboradoresData);
            } catch (error) {
                console.error("Error fetching colaboradores: ", error);
            }
        };
        fetchColaboradores();
    }, []);

    const handleGenerateReport = (format) => {
        console.log(`Generando informe ${format} para colaboradores en ${language}...`);
        switch (format) {
            case 'PDF':
                generatePDFReport(colaboradores, language);
                break;
            case 'CSV':
                generateCSVReport(colaboradores, language);
                break;
            case 'XML':
                generateXMLReport(colaboradores, language);
                break;
            default:
                console.log("Formato de informe no reconocido: ", format);
                break;
        }
    };

    return (
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Informes de Colaboradores</h1>
                </div>
                <form className='mproye'>
                    <label>Seleccione el Idioma:</label>
                    <select className='laselecta' value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                        <option value="fr">Francés</option>
                    </select>
                    <br></br>
                    <label>Generar Informe:</label>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('PDF')}>Generar Informe PDF</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('CSV')}>Generar Informe CSV</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('XML')}>Generar Informe XML</button>
                    <br></br>
                    <Link className='back' to="/gestionColaboradores">Regresar</Link>
                </form>
            </div>
        </div>
    );
}

export default ReportesColaboradores;
