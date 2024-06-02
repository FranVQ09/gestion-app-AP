import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase correctamente
import { collection, addDoc, getDocs } from 'firebase/firestore';
import '../../styles/Foros.css';  


function Foros() {
  const [nombreForo, setNombreForo] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyect, setSelectedProyect] = useState('');

  useEffect(() => {
    const obtenerProyectos = async () => {
        const proyectosCollection = collection(db, 'proyecto');
        const querySnapshot = await getDocs(proyectosCollection);
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosData);
    };

    obtenerProyectos();
}, []);

  const handleInputChange = (e) => {
    setNombreForo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'foros'), {
        nombreForo: nombreForo,
        exclusivoPara: selectedProyect
      });
      alert('Foro creado correctamente');
      setNombreForo('');
      setSelectedProyect('');
    } catch (error) {
      console.error(error);
      alert('Error al crear el foro');
    }
  };

  return (
    <div className='content'>
      <div className='flex-div'>
        <div className='name-content'>
          <h1 className='logo'>Crear Foro</h1>
        </div>
        <div>
          <form className='forum' onSubmit={handleSubmit}>
            <label>
              Nombre del Foro:
              <input
                type='text'
                value={nombreForo}
                onChange={handleInputChange}
                placeholder='Foro Odyssey'
              />
            </label>
            <label>
              Exclusivo para:
              <select className='laselecta' id="proyecto" value={selectedProyect} onChange={(e) => setSelectedProyect(e.target.value)}>
                <option value="">Seleccione un proyecto</option>
                    {proyectos.map(proyecto => (
                        <option key={proyecto.id} value={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</option>
                    ))}
                <option value="publico">Para todo colaborador</option>
                </select>
            </label>
            <button className='boton' type='submit'>Crear Foro</button>
            <Link className='back' to="/evaluaciones">Regresar</Link>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default Foros;
