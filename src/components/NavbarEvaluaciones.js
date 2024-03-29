import React from 'react'
import { Link } from 'react-router-dom'


function NavbarEvaluaciones() {
  return (
    <div>
      <ul>
        <li><Link to="/informeGeneral">Informe General</Link></li>
        <li><Link to="/burndownChart">Burndown Chart</Link></li>
        <li><Link to="/foros">Foros</Link></li>
        <li><Link to="/menu">Salir</Link></li>
      </ul>
    </div>
  )
}

export default NavbarEvaluaciones
