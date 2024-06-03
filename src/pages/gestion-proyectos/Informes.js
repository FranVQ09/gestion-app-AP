import React, { useEffect, useState} from 'react'
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';
import { jsPDF } from 'jspdf';

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

            const proyectoXML = generarXML(proyectoDoc);
            
            const blob = new Blob([proyectoXML], { type: 'text/xml' });
            
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${proyectoSeleccionado}_informe.xml`;
            
            a.click();
            
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generando el informe XML: ", error);
        }
    };

    const generarXML = (proyectoDoc) => {
        let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<proyecto>\n';
        
        for (const key in proyectoDoc) {
            if (proyectoDoc.hasOwnProperty(key)) {
                if (key === 'tareas' && Array.isArray(proyectoDoc[key])) {
                    proyectoDoc[key].forEach((tarea, index) => {
                        xmlString += `<tarea id="${index + 1}">\n`;
                        for (const tareaKey in tarea) {
                            if (tarea.hasOwnProperty(tareaKey)) {
                                xmlString += `<${tareaKey}>${tarea[tareaKey]}</${tareaKey}>\n`;
                            }
                        }
                        xmlString += `</tarea>\n`;
                    });
                } else {
                    xmlString += `<${key}>${proyectoDoc[key]}</${key}>\n`;
                }
            }
        }
        
        xmlString += '</proyecto>';
        return xmlString;
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
            let csvContent = "";
    
            const orderedKeys = [
                'nombreProyecto',
                'descripcion',
                'encargado',
                'colaboradores',
                'estadoProyecto',
                'fechaInicio',
                'fechaFin',
                'recursos',
                'presupuesto',
                'tareas',
                'historial'
            ];
    
            orderedKeys.forEach(key => {
                if (data.hasOwnProperty(key)) {
                    if (key === 'tareas' && Array.isArray(data[key])) {
                        data[key].forEach((tarea, index) => {
                            for (const tareaKey in tarea) {
                                if (tarea.hasOwnProperty(tareaKey)) {
                                    csvContent += `Tarea ${index + 1} - ${tareaKey},${tarea[tareaKey]}\n`;
                                }
                            }
                        });
                    } else {
                        csvContent += `${key},${data[key]}\n`;
                    }
                }
            });
    
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
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

    const informeGeneralXML = async () => {
        try {
            let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<informeGeneral>\n';
    
            proyectos.forEach(proyecto => {
                xmlString += `<proyecto>\n`;
    
                for (const key in proyecto) {
                    if (proyecto.hasOwnProperty(key)) {
                        if (key === 'tareas' && Array.isArray(proyecto[key])) {
                            proyecto[key].forEach((tarea, index) => {
                                xmlString += `<tarea id="${index + 1}">\n`;
                                for (const tareaKey in tarea) {
                                    if (tarea.hasOwnProperty(tareaKey)) {
                                        xmlString += `<${tareaKey}>${tarea[tareaKey]}</${tareaKey}>\n`;
                                    }
                                }
                                xmlString += `</tarea>\n`;
                            });
                        } else {
                            xmlString += `<${key}>${proyecto[key]}</${key}>\n`;
                        }
                    }
                }
    
                xmlString += `</proyecto>\n`;
            });
    
            xmlString += '</informeGeneral>';
    
            const blob = new Blob([xmlString], { type: 'text/xml' });
    
            const url = window.URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            a.download = `informe_general_proyectos.xml`;
    
            a.click();
    
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generando el informe general en XML: ", error);
        }
    };

    const informeGeneralCSV = async () => {
        try {
            if (proyectos.length === 0) {
                alert('No hay proyectos disponibles');
                return;
            }
    
            let csvContent = "";
    
            const orderedKeys = [
                'nombreProyecto',
                'descripcion',
                'encargado',
                'colaboradores',
                'estadoProyecto',
                'fechaInicio',
                'fechaFin',
                'recursos',
                'presupuesto',
                'tareas',
                'historial'
            ];
    
            proyectos.forEach(proyecto => {
                orderedKeys.forEach(key => {
                    if (proyecto.hasOwnProperty(key)) {
                        if (key === 'tareas' && Array.isArray(proyecto[key])) {
                            proyecto[key].forEach((tarea, index) => {
                                for (const tareaKey in tarea) {
                                    if (tarea.hasOwnProperty(tareaKey)) {
                                        csvContent += `Proyecto: ${proyecto.nombreProyecto}, Tarea ${index + 1} - ${tareaKey},${tarea[tareaKey]}\n`;
                                    }
                                }
                            });
                        } else {
                            csvContent += `Proyecto: ${proyecto.nombreProyecto}, ${key},${proyecto[key]}\n`;
                        }
                    }
                });
            });
    
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `informe_general.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generando el informe general CSV: ", error);
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
                <br></br>
                <label>Informes proyectos específicos:</label>
                <button className='boton' type="button" onClick={generarInforme}>Generar Informe PDF</button>
                <button className='boton' type="button" onClick={generarInformeXML}>Generar Informe XML</button>
                <button className='boton' type="button" onClick={generarInformeCSV}>Generar Informe CSV</button>
                <br></br>
                <label>Informes para todos los proyectos:</label>
                <button className='boton' type="button" onClick={informeGeneral}>Generar Informe General</button>
                <button className='boton' type="button" onClick={informeGeneralXML}>Generar Informe General XML</button>
                <button className='boton' type="button" onClick={informeGeneralCSV}>Generar Informe General CSV</button>
                <Link className='back' to="/gestionProyectos">Regresar</Link>
            </form>
        </div>
    </div>
  )
}


export default Informes
