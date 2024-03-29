// RegistrarColaborador.js
import React, { useState, useEffect } from 'react';
import db from '../../fisebaseConfig/firebaseConfig';
import { Link } from 'react-router-dom';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';

function RegistrarColaborador() {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [correo, setCorreo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [showProyectosDropdown, setShowProyectosDropdown] = useState(false);

  useEffect(() => {
    const fetchProyectos = async () => {
      const proyectosCollection = collection(db, 'proyectos');
      const proyectosSnapshot = await getDocs(proyectosCollection);
      const proyectosData = proyectosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectosData);
    };
    fetchProyectos();
  }, []);

  const handleEstadoChange = (e) => {
    setEstado(e.target.value);
    if (e.target.value === 'trabajando') {
      setShowProyectosDropdown(true);
    } else {
      setShowProyectosDropdown(false);
      setProyecto('');
    }
  };

  const store = async (e) => {
    e.preventDefault();
    if (!correo.endsWith('@estudiantec.cr')) {
      setMensaje('El correo electrónico debe ser de la forma: usuario@estudiantec.cr');
      return;
    }
    await addDoc(collection(db, 'colaboradores'), {
      nombre: nombre,
      cedula: cedula,
      correo: correo,
      departamento: departamento,
      telefono: telefono,
      estado: estado,
      proyecto: proyecto
    });
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
    }, 3000);
  };

  return (
    <div>
      <h1>Registrar Colaborador</h1>
      <div>
        <form onSubmit={store}>
          <div className='nombreColaborador'>
            <label htmlFor="nombre">Nombre Completo:</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
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
            <select id="estado" name="estado" value={estado} onChange={handleEstadoChange} required>
              <option value="" disabled>Seleccionar estado</option>
              <option value="trabajando">Trabajando en un proyecto</option>
              <option value="libre">Libre</option>
            </select>
          </div>
          {showProyectosDropdown && (
            <div className='proyectoColaborador'>
              <label htmlFor='proyecto'>Nombre de Proyecto:</label>
              <select id="proyecto" name='proyecto' value={proyecto} onChange={(e) => setProyecto(e.target.value)} required>
                <option value="" disabled>Seleccionar proyecto</option>
                {proyectos.map((proyecto) => (
                  <option key={proyecto.id} value={proyecto.nombre}>{proyecto.nombre}</option>
                ))}
              </select>
            </div>
          )}
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
