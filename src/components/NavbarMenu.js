import React from 'react'
import { Link } from 'react-router-dom';

const NavbarMenu = () => {
  return (
    <div className='menuPrincipal'>
        <Link to="/gestionColaboradores">Gesitón de Colaboradores</Link>
        <Link to="/gestionProyectos">Gestión de Proyectos</Link>
        <Link to="/evaluaciones">Evaluación</Link>
        <Link to="/">Salir</Link>
    </div>
  );
}

export default NavbarMenu;
