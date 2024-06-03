// src/pages/gestion-colaboradores/ReporteColaboradores.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';
import { Link } from 'react-router-dom';
import { generatePDFReport, generateCSVReport, generateXMLReport } from '../../utils/reportUtils';
import '../../styles/ReportesColaboradores.css';

function ReporteColaboradores() {
    const [colaboradores, setColaboradores] = useState([]);
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const fetchColaboradores = async () => {
            const querySnapshot = await getDocs(collection(db, 'colaboradores'));
            const colaboradoresData = querySnapshot.docs.map(doc => doc.data());
            setColaboradores(colaboradoresData);
        };
        fetchColaboradores();
    }, []);

    const handleGenerateReport = (format) => {
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
                break;
        }
    };

    return (
        <div className='content'>
            <div className='flex-div'>
                <div className='name-content'>
                    <h1 className='logo'>Reporte de Colaboradores</h1>
                </div>
                <form className='repoColab'>
                    <label>Seleccione el Idioma:</label>
                    <select className='repoColabSelect' value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                        <option value="zh">Chino</option>
                        <option value="hi">Hindi</option>
                        <option value="ar">Árabe</option>
                        <option value="pt">Portugués</option>
                        <option value="fr">Francés</option>
                        <option value="ru">Ruso</option>
                        <option value="ja">Japonés</option>
                        <option value="de">Alemán</option>
                    </select>
                    <br></br>
                    <label>Generar Reporte:</label>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('PDF')}>Generar Reporte PDF</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('CSV')}>Generar Reporte CSV</button>
                    <button className='boton' type="button" onClick={() => handleGenerateReport('XML')}>Generar Reporte XML</button>
                    <br></br>
                    <Link className='back' to="/gestionColaboradores">Regresar</Link>
                </form>
            </div>
        </div>
    );
}

export default ReporteColaboradores;
