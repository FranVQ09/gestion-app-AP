import React from 'react'
import {Link} from 'react-router-dom';

function BurndownChart() {
  return (
    <div>
      <h1>Gráfico de Burndown</h1>
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

export default BurndownChart
