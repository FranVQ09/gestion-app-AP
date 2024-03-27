import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
        <h1>Login</h1>
        <form>
          <input type="text" placeholder="Correo electrónico" />
          <input type="password" placeholder="Contraseña" />
          <Link to="/menu">
            <button type="submit">Login</button>
          </Link>
        </form>
    </div>
    )
}

export default LoginPage;
