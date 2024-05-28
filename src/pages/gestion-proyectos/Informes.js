import React from 'react'
import { Link } from 'react-router-dom';
import '../../styles/Informes.css';

function Informes() {
  return (
    <div className='content'>
        <div className='flex-div'>
            <div className='name-content'>
                <h1 className='logo'>Informes del Proyecto</h1>
            </div>
            <form className='mproye'>
                <label htmlFor="proyecto">Seleccione un Proyecto:</label>
                <select className='laselecta'>

                </select>
                <Link className='back' to="/gestionProyectos">Regresar</Link>
            </form>
        </div>
    </div>
  )
}

export default Informes
