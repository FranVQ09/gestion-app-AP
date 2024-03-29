import React from 'react';
import {Link} from 'react-router-dom';

function Foros() {
  return (
    <div>
      <h1>Foros</h1>
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

export default Foros
