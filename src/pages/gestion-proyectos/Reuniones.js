import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../../fisebaseConfig/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


function Reuniones() {

    const [ tema, setTema ] = useState('');
    const [ fecha, setFecha ] = useState('');
    const [ medio, setMedio ] = useState('');
    const [ colaboradores, setColaboradores ] = useState('');
    const [ mensaje, setMensaje ] = useState('');

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'joseguba1604@gmail.com',
            pass: 'CowardlySpice16'
        }
    });

    const enviarCorreo = (destinatario, asunto, contenido) => {
        const mailOptions = {
            from: 'joseguba1604@gmail.com',
            to: destinatario,
            subject: asunto,   
            text: contenido
        };
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo', error);
        } else {
            console.log('Correo enviado correctamente', info.response);
        }
    });

    const reunionesCollection = collection(db, 'reuniones');

    const storeReuniones = async (e) => {
        e.preventDefault();
        try {
            await addDoc(reunionesCollection, { 
                tema: tema, 
                fecha: fecha, 
                medio: medio, 
                colaboradores: colaboradores ? colaboradores.split(',').map(c => c.trim()) : [], 
            });
            alert('Reunión registrada correctamente');
            setTema('');
            setFecha('');
            setMedio('');
            setColaboradores('');

            setTimeout(() => {
                setMensaje('');
            }, 3000);
        } catch (error) {
            console.error('Error al registrar la reunión', error);
        }
    }



  return (
    <div>
      <h1>Reuniones</h1>
        <div>
            <form onSubmit={storeReuniones}>
                <label htmlFor='tema'>Tema: </label>
                <input type='text' value={tema} id='tema' name='tema' onChange={(e) => setTema(e.target.value)} required></input>
                <label htmlFor='fecha'>Fecha: </label>
                <input type='text' value={fecha} id='fecha' name='fecha' onChange={(e) => setFecha(e.target.value)} required></input>
                <label htmlFor='medio'>Medio: </label>
                <input type='text' value={medio} id='medio' name='medio' onChange={(e) => setMedio(e.target.value)} required></input>
                <label htmlFor='colaboradores'>Colaboradores: </label>
                <input type="text" value={colaboradores} onChange={(e) => setColaboradores(e.target.value)} placeholder="Colaboradores (separados por comas)" required />
                <div>
                    <button type='submit'>Crear Reunión</button>
                </div>
                <div>
                    <button type='submit'>Enviar Correo</button>
                </div>
            </form>
            <div>{mensaje}</div>
        </div>
        <Link to="/gestionProyectos">
            <button>Salir</button>
        </Link>
    </div>
  )
}

export default Reuniones
