// src/pages/gestion-colaboradores/GestionColaboradores.js
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavbarColaboradores';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';
import { generatePDFReport, generateCSVReport, generateXMLReport } from '../../utils/reportUtils';

const GestionColaboradores = () => {
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
    <div>
      <Navbar />

    </div>
  );
}

export default GestionColaboradores;
