// src/utils/reportUtils.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { parse } from 'js2xmlparser';
import translations from './translations';

const translateData = (data, language) => {
  return data.map(item => ({
    [translations[language].nombre]: item.nombre,
    [translations[language].cedula]: item.cedula,
    [translations[language].correo]: item.correo,
    [translations[language].telefono]: item.telefono,
    [translations[language].departamento]: item.departamento,
    [translations[language].estado]: translations[language][item.estado.toLowerCase().replace(/ /g, '_')],
    [translations[language].proyecto]: item.proyecto === 'Sin asignar' ? translations[language].sin_asignar : item.proyecto
  }));
};

const generatePDFReport = (data, language) => {
  const doc = new jsPDF();
  const translatedData = translateData(data, language);
  const columns = Object.keys(translatedData[0]);
  const rows = translatedData.map(item => Object.values(item));
  doc.text(20, 20, `Reporte de Colaboradores (${language})`);
  doc.autoTable({ head: [columns], body: rows });
  doc.save(`reporte_colaboradores_${language}.pdf`);
};

const generateCSVReport = (data, language) => {
  const translatedData = translateData(data, language);
  const csv = Papa.unparse(translatedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `reporte_colaboradores_${language}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateXMLReport = (data, language) => {
  const translatedData = translateData(data, language);
  const xml = parse("colaboradores", translatedData);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `reporte_colaboradores_${language}.xml`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { generatePDFReport, generateCSVReport, generateXMLReport };
