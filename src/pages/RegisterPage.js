import React, { useState, useEffect} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import db from '../fisebaseConfig/firebaseConfig';
import '../styles/RegistrarCuenta.css';


function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState('');
    const [proyecto, setProyecto] = useState('');
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();

        // Validar que no haya un colaborador con la misma cédula
        const cedulaQuery = await getDocs(query(collection(db, 'colaboradores'), where('cedula', '==', cedula)));
        if (!cedulaQuery.empty) {
        alert('Ya existe un colaborador con la misma cédula.');
        return;
        }

        const correoQuery = await getDocs(query(collection(db, 'colaboradores'), where('correo', '==', correo)));
        if (!correoQuery.empty) {
        alert('Ya existe otro colaborador con el mismo correo.');
        return;
        }

        const telefonoQuery = await getDocs(query(collection(db, 'colaboradores'), where('telefono', '==', telefono)));
        if (!telefonoQuery.empty) {
        alert('Ya existe otro colaborador con ese número de teléfono');
        return;
        }
    
        // Validar formato de correo electrónico
        if (!correo.endsWith('@estudiantec.cr')) {
        alert('El correo electrónico debe ser de la forma: usuario@estudiantec.cr');
        return;
        }
    
        // Resto del código para almacenar el colaborador si pasa las validaciones
        await addDoc(collection(db, 'colaboradores'), {
        nombre: nombre,
        cedula: cedula,
        correo: correo,
        contraseña: password,
        departamento: departamento,
        telefono: telefono,
        estado: 'libre',
        });
    
    
        alert('Colaborador registrado correctamente');
        navigate('/')
        setNombre('');
        setCedula('');
        setCorreo('');
        setPassword('');
        setDepartamento('');
        setTelefono('');
        setEstado('');
        setTimeout(() => {
        }, 3000);
    };
    return (
        <div className='content'>
            <div className='flex-div'>
              <div className='name-content'>
                <h1 className='logo'>Registrar Cuenta</h1>
              </div>
            <form className='regis' onSubmit={register}>
                <label htmlFor="nombre">Nombre completo:</label>
                <input type="text" id="nombre" name="nombre" placeholder="John Doe" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <label htmlFor="cedula">Cédula:</label>
                <input type="text" id="cedula" name="cedula" placeholder="123456789" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
                <label htmlFor="correo">Correo Electrónico:</label>
                <input type="email" id="correo" name="correo" placeholder="john.doe@estudiantec.cr" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                <label htmlFor="password">Contraseña:</label>
                <input type='password' id='password' name='password' placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                <label htmlFor="departamento">Departamento:</label>
                <input type="text" id="departamento" name="departamento" placeholder="Financiero contable" value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />
                <label htmlFor="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" placeholder="81234567" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />`
                <button className="boton" type="submit">
                Registrarse
                </button>
                <Link className='back' to="/">Regresar</Link>
            </form>
          </div>
        </div>
      )
}

export default RegisterPage
