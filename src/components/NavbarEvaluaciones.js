import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GestionEvaluaciones.css';

const NavbarEvaluaciones = () => {
    return (
      <div className='content'>
        <div className='flex-div'>
          <div className='name-content'>
            <h1 className='logo'>Evaluaciones</h1>
          </div>
          <form className="eva"> 
            <Link className='boton' to="/informeGeneral">Informe General</Link>
            <Link className='boton' to="/burndownChart">Burndown Chart</Link>
            <Link className='boton' to="/foros">Foros</Link>
            <Link className='back' to="/menu">Regresar</Link>
          </form>
        </div>
      </div>
    );
  }

export default NavbarEvaluaciones;