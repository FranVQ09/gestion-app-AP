import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/registrarColaborador">Registrar Colaborador</Link></li>
                <li><Link to="/modificarColaborador">Modificar Colaborador</Link></li>
                <li><Link to="/asignacion">Asignación</Link></li>
                <li><Link to="/menu">Salir</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;