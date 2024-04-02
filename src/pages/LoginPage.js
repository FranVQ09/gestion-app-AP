import React from 'react';
import '../styles/LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="content">
      <div className="flex-div">
        <div className="name-content">
          <h1 className="logo">QUE VIVA LA PEPA</h1>
          <p>Confianza y tecnología para el CIC</p>
        </div>
        <form method="POST" action="/login">
          <label htmlFor="correo">Correo electrónico:</label>
          <input type="email" name="correo" placeholder="nombre.apellido@estudiantec.cr" tabIndex="1" title="Ingrese su correo electrónico de la empresa" required onInvalid={(e) => e.target.setCustomValidity('Por favor ingrese su correo electrónico.')} onInput={(e) => e.target.setCustomValidity('')} />
          <label htmlFor="password">Contraseña:</label>
          <input type="password" name="password" placeholder="********" required tabIndex="2" title="Debe ingresar su contraseña" onInvalid={(e) => e.target.setCustomValidity('Por favor ingrese su contraseña.')} onInput={(e) => e.target.setCustomValidity('')} />
          <Link to="/menu" className="login" tabIndex="3">Iniciar sesión</Link>
          <hr />
          <button className="create-account" onClick={() => { window.location.href = '/registro'; }} tabIndex="4">Crear cuenta nueva</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
