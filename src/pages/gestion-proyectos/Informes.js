import React, { useEffect, useState} from 'react'
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';

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
                <Link className='back' to="/gestionProyectos">Regresar</Link>
            </form>
        </div>
    </div>
  )
}

export default Informes
