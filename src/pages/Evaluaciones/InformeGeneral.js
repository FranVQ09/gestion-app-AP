import React from 'react'
import { Link } from 'react-router-dom';

function InformeGeneral() {
  return (
    <div>
      <h1>Informe General</h1>
      <div>
        <Link to="/evaluaciones">
        <button>
          Salir
        </button>
        </Link>
      </div>
    </div>
  )
}

export default InformeGeneral
