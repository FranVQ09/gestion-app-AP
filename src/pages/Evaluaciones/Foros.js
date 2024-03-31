import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase correctamente
import { collection, addDoc } from 'firebase/firestore';

function Foros() {
  const [nombreForo, setNombreForo] = useState('');

  const handleInputChange = (e) => {
    setNombreForo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'foros'), {
        NombreForo: nombreForo,
        Mensajes: []
      });
      alert('Foro creado correctamente');
      setNombreForo('');
    } catch (error) {
      console.error(error);
      alert('Error al crear el foro');
    }
  };

  return (
    <div>
      <h1>Foros</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del Foro:
            <input
              type='text'
              value={nombreForo}
              onChange={handleInputChange}
            />
          </label>
          <button type='submit'>Crear Foro</button>
        </form>
      </div>
      <div>
        <Link to="/evaluaciones">
          <button>Regresar</button>
        </Link>
      </div>
    </div>
  );
}

export default Foros;
