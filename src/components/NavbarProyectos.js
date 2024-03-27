import React from 'react';
import {Link} from "react-router-dom";


const NavbarProyectos = () => {
        return (
            <nav>
                <ul>
                    <li><Link to="/crearProyectos">Crear Proyecto</Link></li>
                    <li><Link to="/consultarProyectos">Consultar Proyecto</Link></li>
                    <li><Link to="/modificarProyecto">Modificar Proyecto</Link></li>
                    <li><Link to="/crearReuniones">Crear Reunión</Link></li>
                    <li><Link to="/menu">Salir</Link></li>
                </ul>
            </nav>
        );
    }
export default NavbarProyectos;
