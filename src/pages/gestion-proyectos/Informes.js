import React, { useEffect, useState} from 'react'
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';
import { jsPDF } from 'jspdf';
import { create } from 'xmlbuilder2';

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
            docPDF.text("Informe del Proyecto", 10, 10);

            let yPosition = 20;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    docPDF.text(`${key}: ${data[key]}`, 10, yPosition);
                    yPosition += 10;
                }
            }

            docPDF.save(`${proyectoSeleccionado}_informe.pdf`);
        } catch (error) {
            console.error("Error generando el informe: ", error);
        }
    }

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
    
          // Crear un documento XML
          const root = create({ version: '1.0' }).ele('Proyecto');
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              root.ele(key).txt(data[key]);
            }
          }
    
          const xmlString = root.end({ prettyPrint: true });
          const blob = new Blob([xmlString], { type: 'application/xml' });
    
          // Descargar el archivo XML
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${proyectoSeleccionado}_informe.xml`;
          link.click();
    
        } catch (error) {
          console.error("Error generando el informe: ", error);
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
                <Link className='back' to="/gestionProyectos">Regresar</Link>
            </form>
        </div>
    </div>
  )
}

export default Informes
