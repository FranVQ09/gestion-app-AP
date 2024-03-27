import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function ModificarColaborador() {
  const [cedula, setCedula] = useState('');
  const [colaborador, setColaborador] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const [usuarioNoEncontrado, setUsuarioNoEncontrado] = useState(false);

  useEffect(() => {
    // Acciones del formulario
    if (!cedula && colaborador) { // Si la cédula está vacía y el formulario está abierto
      setMostrarFormulario(false); // Cerrar el formulario
      setColaborador(null); // Limpiar los datos del colaborador
    }
  }, [cedula]); // Ejecutar este efecto cada vez que cambie la cédula

  const handleSubmit = async (e) => {
    //Función que se encarga de manejar el evento de submit del formulario
    e.preventDefault();
    await searchColaborador();
    setMostrarFormulario(true); 
  }

  const searchColaborador = async () => {
    //Función que busca el colaborador en la base de datos mediante la cedula y toma los datos del colaborador
    const colaboradoresCollection = collection(db, 'colaboradores');
    const q = query(colaboradoresCollection, where('cedula', '==', cedula));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      const colaboradoresDoc = querySnapshot.docs[0];
      setColaborador({
        id: colaboradoresDoc.id,
        ...colaboradoresDoc.data()
      });
      setUsuarioNoEncontrado(false);
    } else {
      setUsuarioNoEncontrado(true);
      setTimeout(() => {
        setUsuarioNoEncontrado(false);
      }, 3000);
    }
  }

  const updateColaborador = async () => {
    //Función que se encarga de actualizar el colaborador en la base de datos
    if (!colaborador) {
      return;
    }
    try {
      const colaboradorDocRef = doc(db, "colaboradores", colaborador.id);
      const newData = {
        correo: colaborador.correo, 
        telefono: colaborador.telefono, 
        departamento: colaborador.departamento, 
        estado: colaborador.estado
      };
      await updateDoc(colaboradorDocRef, newData); //Esto actualiza los datos del colaborador
      alert("Colaborador actualizado correctamente.");
      setCedula('');
      setColaborador(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      alert("Error actualizando colaborador.");
    }
  };

  return (
    <div>
      <h1>Modificar Colaborador</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Cédula:
          <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
        </label>
        <br />
        <button type="submit">Buscar</button> 
      </form>

      {usuarioNoEncontrado && (
        <p>Usuario no encontrado</p>
      )}

      {mostrarFormulario && colaborador && (
        <form>
          <label>
            Correo:
            <input type="email" name="correo" value={colaborador.correo} onChange={(e) => setColaborador({ ...colaborador, correo: e.target.value })} disabled={!colaborador} />
          </label>
          <br />
          <label>
            Teléfono:
            <input type="tel" name="telefono" value={colaborador.telefono} onChange={(e) => setColaborador({ ...colaborador, telefono: e.target.value })} disabled={!colaborador} />
          </label>
          <br />
          <label>
            Departamento:
            <input type="text" name="departamento" value={colaborador.departamento} onChange={(e) => setColaborador({ ...colaborador, departamento: e.target.value })} disabled={!colaborador} />
          </label>
          <br />
          <label>
            Estado:
            <select name="estado" value={colaborador.estado} onChange={(e) => setColaborador({ ...colaborador, estado: e.target.value })} disabled={!colaborador}>
                <option value="" disabled>Seleccionar estado</option>
                <option value="trabajando">Trabajando en un proyecto</option>
                <option value="libre">Libre</option>
            </select>
          </label>
          <br />
          <button type="button" onClick={updateColaborador} disabled={!colaborador}>
            Actualizar
          </button>
        </form>
      )}
      <Link to="/gestionColaboradores">
        <button>Salir</button>
      </Link>
    </div>
  );
}

export default ModificarColaborador;
