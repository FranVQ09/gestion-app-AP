import React from 'react';
import {Link} from "react-router-dom";


const NavbarProyectos = () => {
        return (
            <nav>
                <ul>
                    <li><Link to="/crearProyecto">Crear Proyecto</Link></li>
                    <li><Link to="/consultarProyecto">Consultar Proyecto</Link></li>
                    <li><Link to="/modificarProyecto">Modificar Proyecto</Link></li>
                    <li><Link to="/reuniones">Crear Reunión</Link></li>
                    <li><Link to="/menu">Salir</Link></li>
                </ul>
            </nav>
        );
    }
export default NavbarProyectos;
