import React, { useEffect, useState} from 'react'
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';
import { jsPDF } from 'jspdf';
import { create } from 'xmlbuilder2';
import Papa from 'papaparse';

function Informes() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');

  useEffect(() => {
      const obtenerProyectos = async () => {
          const proyectosCollection = collection(db, 'proyecto');
          const querySnapshot = await getDocs(proyectosCollection);
          const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProyectos(proyectosData);
      };

      obtenerProyectos();
  }, []);

  console.log(proyectos)

  const generarInforme = async () => {
    if (!proyectoSeleccionado) {
        alert('Por favor, seleccione un proyecto');
        return;
    }

    try {
        const proyectoDoc = proyectos.find(proyecto => proyecto.nombreProyecto === proyectoSeleccionado);
        if (!proyectoDoc) {
            alert('Proyecto no encontrado');
            return;
        }

        const docRef = doc(db, 'proyecto', proyectoDoc.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No existe el documento!");
            return;
        }

        const data = docSnap.data();

        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text("Informe del Proyecto", 10, 10);
        docPDF.setFontSize(12);

        let yPosition = 20;
        const pageHeight = docPDF.internal.pageSize.height;
        const margin = 10;
        const lineSpacing = 10;
        const maxLineWidth = 180;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                let text = `${key}: `;
                if (key === 'tareas' && Array.isArray(data[key])) {
                    text += '\n';
                    data[key].forEach((tarea, index) => {
                        text += `Tarea ${index + 1}:\n`;
                        for (const tareaKey in tarea) {
                            if (tarea.hasOwnProperty(tareaKey)) {
                                text += `  ${tareaKey}: ${tarea[tareaKey]}\n`;
                            }
                        }
                    });
                } else if (key === 'historial') {
                    const lines = docPDF.splitTextToSize(`${text}${data[key]}`, maxLineWidth);
                    text = lines.join('\n');
                } else {
                    text += data[key];
                }

                const lines = docPDF.splitTextToSize(text, maxLineWidth);
                lines.forEach(line => {
                    if (yPosition > pageHeight - margin) {
                        docPDF.addPage();
                        yPosition = margin;
                    }
                    docPDF.text(line, margin, yPosition);
                    yPosition += lineSpacing;
                });
            }
        }

        docPDF.save(`${proyectoSeleccionado}_informe.pdf`);
    } catch (error) {
        console.error("Error generando el informe: ", error);
    }
  };

  const generarInformeXML = async () => {
      if (!proyectoSeleccionado) {
        alert('Por favor, seleccione un proyecto');
        return;
      }
  
      try {
        const proyectoDoc = proyectos.find(proyecto => proyecto.nombreProyecto === proyectoSeleccionado);
        if (!proyectoDoc) {
          alert('Proyecto no encontrado');
          return;
        }
  
        const docRef = doc(db, 'proyecto', proyectoDoc.id);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          console.log("No such document!");
          return;
        }
  
        const data = docSnap.data();
  
        
        const root = create({ version: '1.0' }).ele('Proyecto');
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            root.ele(key).txt(data[key]);
          }
        }
  
        const xmlString = root.end({ prettyPrint: true });
        const blob = new Blob([xmlString], { type: 'application/xml' });
  
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${proyectoSeleccionado}_informe.xml`;
        link.click();
  
      } catch (error) {
        console.error("Error generando el informe: ", error);
      }
    };
  
  const generarInformeCSV = async () => {
    if (!proyectoSeleccionado) {
      alert('Por favor, seleccione un proyecto');
      return;
    }

    try {
        const proyectoDoc = proyectos.find(proyecto => proyecto.nombreProyecto === proyectoSeleccionado);
        if (!proyectoDoc) {
            alert('Proyecto no encontrado');
            return;
        }

        const docRef = doc(db, 'proyecto', proyectoDoc.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No existe el documento!");
            return;
        }

        const data = docSnap.data();
        const csvData = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === 'tareas' && Array.isArray(data[key])) {
                    data[key].forEach((tarea, index) => {
                        const tareaData = { [`Tarea ${index + 1}`]: '' };
                        for (const tareaKey in tarea) {
                            if (tarea.hasOwnProperty(tareaKey)) {
                                tareaData[`${tareaKey}`] = tarea[tareaKey];
                            }
                        }
                        csvData.push(tareaData);
                    });
                } else {
                    csvData.push({ [key]: data[key] });
                }
            }
        }

        
        const csv = Papa.unparse(csvData, { header: true });

        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${proyectoSeleccionado}_informe.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generando el informe CSV: ", error);
    }
  };

  const informeGeneral = async () => {
    try {
      const docPDF = new jsPDF();
      docPDF.setFontSize(16);
      docPDF.text("Informe General de Proyectos", 10, 10);
      docPDF.setFontSize(12);

      let yPosition = 20;
      const pageHeight = docPDF.internal.pageSize.height;
      const margin = 10;
      const lineSpacing = 10;
      const maxLineWidth = 180;

      proyectos.forEach(proyecto => {
          if (proyecto.hasOwnProperty('nombreProyecto')) {
              const nombreProyectoText = `nombreProyecto: ${proyecto.nombreProyecto}`;
              const lines = docPDF.splitTextToSize(nombreProyectoText, maxLineWidth);
              lines.forEach(line => {
                  if (yPosition > pageHeight - margin) {
                      docPDF.addPage();
                      yPosition = margin;
                  }
                  docPDF.text(line, margin, yPosition);
                  yPosition += lineSpacing;
              });
          }

          for (const key in proyecto) {
              if (proyecto.hasOwnProperty(key) && key !== 'id' && key !== 'nombreProyecto') {
                  let text = `${key}: `;
                  if (key === 'tareas' && Array.isArray(proyecto[key])) {
                      text = `${key}:\n`;
                      proyecto[key].forEach((tarea, index) => {
                          text += `Tarea ${index + 1}:\n`;
                          for (const tareaKey in tarea) {
                              if (tarea.hasOwnProperty(tareaKey)) {
                                  text += `  ${tareaKey}: ${tarea[tareaKey]}\n`;
                              }
                          }
                      });
                  } else if (key === 'historial') {
                      const lines = docPDF.splitTextToSize(`${text}${proyecto[key]}`, maxLineWidth);
                      text = lines.join('\n');
                  } else {
                      text += proyecto[key];
                  }

                  const lines = docPDF.splitTextToSize(text, maxLineWidth);
                  lines.forEach(line => {
                      if (yPosition > pageHeight - margin) {
                          docPDF.addPage();
                          yPosition = margin;
                      }
                      docPDF.text(line, margin, yPosition);
                      yPosition += lineSpacing;
                  });

                  yPosition += lineSpacing / 2;
              }
          }
          yPosition += lineSpacing;
          if (yPosition > pageHeight - margin) {
              docPDF.addPage();
              yPosition = margin;
          }
          docPDF.setLineWidth(0.5);
          docPDF.line(margin, yPosition, maxLineWidth + margin, yPosition);
          yPosition += lineSpacing;

          yPosition += lineSpacing * 2;
          if (yPosition > pageHeight - margin) {
              docPDF.addPage();
              yPosition = margin;
          }
      });

      docPDF.save(`informe_general_proyectos.pdf`);
  } catch (error) {
      console.error("Error generando el informe general: ", error);
  }
};

  return (
    <div className='content'>
        <div className='flex-div'>
            <div className='name-content'>
                <h1 className='logo'>Informes del Proyecto</h1>
            </div>
            <form className='mproye'>
                <label htmlFor="proyecto">Seleccione un Proyecto:</label>
                <select className='laselecta' id="proyecto" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
                <option value="">Seleccione un proyecto</option>
                    {proyectos.map(proyecto => (
                        <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
                    ))}
                </select>
                <button className='boton' type="button" onClick={generarInforme}>Generar Informe PDF</button>
                <button className='boton' type="button" onClick={generarInformeXML}>Generar Informe XML</button>
                <button className='boton' type="button" onClick={generarInformeCSV}>Generar Informe CSV</button>
                <button className='boton' type="button" onClick={informeGeneral}>Generar Informe General</button>
                <Link className='back' to="/gestionProyectos">Regresar</Link>
            </form>
        </div>
    </div>
  )
}


export default Informes
