import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { doc, collection, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';
import '../../styles/ConsultarForo.css';


function ConsultarForo() {
  const [foros, setForos] = useState([]);
  const [selectedForo, setSelectedForo] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mostrarCajaTexto, setMostrarCajaTexto] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'foros'), (snapshot) => {
      const forosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setForos(forosData);
    });

    return () => unsubscribe();
  }, []);

  const handleForoChange = (event) => {
    setSelectedForo(event.target.value);
    const selectedForoData = foros.find(foro => foro.id === event.target.value);
    setMensajes(selectedForoData ? selectedForoData.mensaje : []);
  };

  const handleMostrarCajaTexto = () => {
    setMostrarCajaTexto(true);
  };

  const handleEnviarMensaje = async () => {
    if (nuevoMensaje.trim() === '') return;
  
    const foroDocRef = doc(db, 'foros', selectedForo);
    await updateDoc(foroDocRef, {
      mensaje: arrayUnion(nuevoMensaje.trim())
    });
  
    window.alert('Mensaje enviado');
    setNuevoMensaje('');
    setMostrarCajaTexto(false);
  
    // Actualizar el estado de los mensajes después de agregar el nuevo mensaje
    setMensajes(prevMensajes => [...prevMensajes, nuevoMensaje.trim()]);
  };

  return (
    <div className='content'>
      <div className='flex-div'>
        <div className='name-content'>
          <h1 className='logo'>Consultar Foro</h1>
        </div>
        <form className='consuforo'>
          <label htmlFor="foroSelect">Selecciona un foro:</label>
          <select id="foroSelect" value={selectedForo} onChange={handleForoChange}>
            <option value="">Selecciona un foro</option>
            {foros.map(foro => (
              <option key={foro.id} value={foro.id}>{foro.nombreForo}</option>
            ))}
          </select>
          {selectedForo && (
            <div>
              <h2>Mensajes del foro</h2>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {mensajes.map((mensaje, index) => (
                  <React.Fragment key={index}>
                    <li>{mensaje}</li>
                    {index < mensajes.length - 1 && <hr />} {/* Agregamos la línea divisora solo si no es el último mensaje */}
                  </React.Fragment>
                ))}
              </ul>
              {!mostrarCajaTexto && (
                <React.Fragment>
                  <button className='boton' onClick={handleMostrarCajaTexto}>Agregar mensaje</button>
                  <Link className='back' to="/evaluaciones">Regresar</Link>
                </React.Fragment>
              )}
              {mostrarCajaTexto && (
                <div>
                  <textarea type="text" value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} />
                  
                  <button className='boton' onClick={handleEnviarMensaje}>Enviar</button>
                  <Link className='back' to="/evaluaciones">Regresar</Link>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
  
  

  
}

export default ConsultarForo;
