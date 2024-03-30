import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/Menu.css';

const NavbarMenu = () => {
  return (
    <div className='content'>
      <div className='flex-div'>
        <div className='name-content'>
          <h1 className='logo'>Página principal</h1>
        </div>
        <form className="navi"> 
          <Link className='boton' to='/gestionColaboradores'>Gestión de Colaboradores</Link>
          <Link className='boton' to='/gestionProyectos'>Gestión de Proyectos</Link>
          <Link className='boton' to='/evaluaciones'>Evaluación</Link>
          <Link className='back' to='/'>Cerrar Sesión</Link>
        </form>
      </div>
    </div>
  );
}

export default NavbarMenu;
