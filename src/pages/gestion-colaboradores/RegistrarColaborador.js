// RegistrarColaborador.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

function RegistrarColaborador() {

  const [ nombre, setNombre ] = useState('');
  const [ cedula, setCedula ] = useState('');
  const [ correo, setCorreo ] = useState('');
  const [ departamento, setDepartamento ] = useState('');
  const [ telefono, setTelefono ] = useState('');
  const [ estado, setEstado ] = useState('');
  const [ proyecto, setProyecto ] = useState('');
  const [ mensaje, setMensaje ] = useState('');


  const colaboradoresCollection = collection(db, 'colaboradores');

  const store = async (e) => {
    //Función que se encarga de registrar el colaborador en la base de datos
    e.preventDefault();

    //Se añade el colaborador a la base de datos
    await addDoc(colaboradoresCollection, { nombre: nombre, cedula: cedula, correo: correo, departamento: departamento, telefono: telefono, estado: estado, proyecto: proyecto });
    alert('Colaborador registrado correctamente');
    setNombre('');
    setCedula('');
    setCorreo('');
    setDepartamento('');
    setTelefono('');
    setEstado('');
    setProyecto('');

    setTimeout(() => {
      setMensaje('');

    }, 3000)
  }

  return (
    <div>
      <h1>Registrar Colaborador</h1>
      <div>
        <form onSubmit={store}>
                <div className='nombreColaborador'>
                    <label htmlFor="nombre">Nombre Completo:</label>
                    <input type="text" id="nombre" name="nombre" value={nombre} onChange={ (e) => setNombre(e.target.value) } required />
                </div>
                <div className='cedulaColaborador'>
                    <label htmlFor="cedula">Cédula:</label>
                    <input type="text" id="cedula" name="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
                </div>
                <div className='correoColaborador'>
                    <label htmlFor="correo">Correo Electrónico:</label>
                    <input type="email" id="correo" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className='departamentoColaborador'>
                    <label htmlFor="departamento">Departamento:</label>
                    <input type="text" id="departamento" name="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />
                </div>
                <div className='telefonoColaborador'>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                </div>
                <div className='estadoColaborador'>
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                        <option value="" disabled>Seleccionar estado</option>
                        <option value="trabajando">Trabajando en un proyecto</option>
                        <option value="libre">Libre</option>
                    </select>
                </div>
                <div className="proyectoColaborador">
                  <label htmlFor='proyecto'>Nombre de Proyecto:</label>
                  <input type="text" id="proyecto" name='proyecto' value={proyecto} onChange={(e) => setProyecto(e.target.value)} />
                </div>

                <button className="registrarColaborador" type="submit">
                  Registrar
                </button>
                <div className='mensaje'> {mensaje} </div>
                <Link to="/gestionColaboradores">
                  <button className="Salir">Salir</button>
                </Link>
        </form>
      </div>
    </div>
  )
}

export default RegistrarColaborador;
