import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { collection, where } from 'firebase/firestore';
import { getDocs, query } from 'firebase/firestore';
import db from '../fisebaseConfig/firebaseConfig';
import { Link } from 'react-router-dom';


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      const colaboradores =  collection(db, 'colaboradores');
      const searchColaborador = query(colaboradores, where('correo', '==', email), where('contraseña', '==', password));
      const colaboradorSnapshot = await getDocs(searchColaborador);
      const userData = colaboradorSnapshot.docs[0].data()

      //Se guardan los datos del usuario que incia sesión
      sessionStorage.setItem('userData', JSON.stringify(userData))

      if (!colaboradorSnapshot.empty) {
        navigate('/menu')
      }
      else {
        alert('Usuario o contraseña incorrectos')
        setEmail('')
        setPassword('')
      }


    } catch (error) {
      console.error(error);
      alert('Ocurrio un error al intentar iniciar sesión')
    }
  }
  return (
    <div className="content">
      <div className="flex-div">
        <div className="name-content">
          <h1 className="logo">CIC</h1>
          <p>Ingeniería en Computación del Tecnológico de Costa Rica</p>
        </div>
        <form onSubmit={handleLogin} method="POST" action="/login">
          <label htmlFor="correo">Correo electrónico:</label>
          <input type="email" name="correo" placeholder="nombre.apellido@estudiantec.cr" tabIndex="1" title="Ingrese su correo electrónico de la empresa" required onInvalid={(e) => e.target.setCustomValidity('Por favor ingrese su correo electrónico.')} onInput={(e) => e.target.setCustomValidity('')} value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Contraseña:</label>
          <input type="password" name="password" placeholder="********" required tabIndex="2" title="Debe ingresar su contraseña" onInvalid={(e) => e.target.setCustomValidity('Por favor ingrese su contraseña.')} onInput={(e) => e.target.setCustomValidity('')} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="login" tabIndex="3">Iniciar sesión</button>
          <hr />
        </form>
        <Link to='/registerCuenta'>
          <button className="create-account" tabIndex="4">Crear cuenta nueva</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
