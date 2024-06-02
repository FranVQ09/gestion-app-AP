import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import db from '../../fisebaseConfig/firebaseConfig';
import '../../styles/ConsultarForo.css';  

function ConsultarForo() {
  const [foros, setForos] = useState([]);
  const [selectedForo, setSelectedForo] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mostrarCajaTexto, setMostrarCajaTexto] = useState(false);
  const [mostrarForo, setMostrarForo] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('userData'));

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


  const handleMostrarCajaTexto = () => {
    setMostrarCajaTexto(true);
  };

  const handleEnviarMensaje = async (event) => {
    event.preventDefault();
    
    if (nuevoMensaje.trim() === '') return;
    
    try {
      const foroDocRef = doc(db, 'foros', selectedForo.id);
      await updateDoc(foroDocRef, {
        mensaje: arrayUnion({mensaje: nuevoMensaje.trim(), autor: userData.nombre}),
      });
      
      window.alert('Mensaje enviado');
      setNuevoMensaje('');
      setMostrarCajaTexto(false);
  
      const foroSnapshot = await getDoc(foroDocRef);
      const foroData = foroSnapshot.data();
      if (foroData) {
        setMensajes(foroData.mensaje || []);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleBuscarForo =  async (event) => {
    event.preventDefault(); 

    try {
      if(selectedForo.exclusivoPara === userData.proyecto || selectedForo.exclusivoPara === 'publico') {
        setMostrarForo(true);
        setMensajes(selectedForo.mensaje);
      } else {
        window.alert('No tienes acceso a este foro');
        return;
      }
    } catch (error) {
      console.error('Error al buscar foro:', error);
    }
  };

  const handleForo = (e) => {
    const selectedForoId = e.target.value;
    const selectedForo = foros.find(foro => foro.id === selectedForoId);
    setSelectedForo(selectedForo);
  }

  return (
    <div className='content'>
      <div className='flex-div'>
        <div className='name-content'>
          <h1 className='logo'>Consultar Foro</h1>
        </div>
        <form className='consuforo'>
          <label htmlFor="foroSelect">Selecciona un foro:</label>
          <select className='laselecta' id="foroSelect" value={selectedForo.id} onChange={handleForo}>
            <option value="">Selecciona un foro</option>
            {foros.map(foro => (
              <option key={foro.id} value={foro.id}>{foro.nombreForo}</option>
            ))}
          </select>
          <button type='submit' onClick={handleBuscarForo}>Buscar Foro</button>
          <br /><Link className='back' to="/evaluaciones">Regresar</Link>
        </form>
        {mostrarForo && (
          <div>
          <br />
          <h2>Mensajes del foro: {mensajes ? mensajes.length : 0}</h2>
          <br />
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {mensajes && mensajes.map((mensaje, index) => (
              <React.Fragment key={index}>
                <li>
                  <p><strong>Autor: </strong> {mensaje.autor}</p>
                  <p><strong>Mensaje: </strong> {mensaje.mensaje}</p>
                </li>
                <hr />
                <br/>
              </React.Fragment>
            ))}
          </ul>
          {!mostrarCajaTexto && (
            <button className='boton' onClick={handleMostrarCajaTexto}>Agregar mensaje</button>
          )}
          {mostrarCajaTexto && (
            <div>
              <textarea className="cajita" type="text" value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} placeholder='¡Hola a todos!'/>
              <button className='boton' onClick={handleEnviarMensaje}>Enviar</button>
              <button className='boton' onClick={() => setMostrarCajaTexto(false)}>Cancelar</button>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultarForo;
