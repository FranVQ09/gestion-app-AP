import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GestionColaboradores.css';

const Navbar = () => {
    return (
      <div className='content'>
        <div className='flex-div'>
          <div className='name-content'>
            <h1 className='logo'>Gestión de Colaboradores</h1>
          </div>
          <form className="cola"> 
            <Link className='boton' to="/registrarColaborador">Registrar Colaborador</Link>
            <Link className='boton' to="/modificarColaborador">Modificar Colaborador</Link>
            <Link className='boton' to="/asignacion">Asignación</Link>
            <Link className='boton' to="/reporteColaboradores">Reporte Colaboradores</Link>
            <Link className='back' to="/menu">Regresar</Link>
          </form>
        </div>
      </div>
    );
  }

export default Navbar;