const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const mysql = require('mysql2');

// Configurar la piscina de conexiones a la base de datos MySQL en la nube
/*const dbPool = mysql.createPool({
    host: 'by9wewrbsgh2joxudcpi-mysql.services.clever-cloud.com',
    user: 'uy44aub6lptawz2c',
    password: '4t03eIWNHgChQqYtypHF',
    database: 'by9wewrbsgh2joxudcpi',
    connectionLimit: 10, // Número máximo de conexiones en la piscina
});*/

// Configuración de la conexión a la base de datos MySQL local
const dbConnection = mysql.createConnection({
    host: 'localhost',         // Cambiar por la dirección de tu servidor MySQL
    user: 'root',              // Usuario de la base de datos
    password: 'root',      // Contraseña del usuario
    database: 'dboPrueba'     // Nombre de la base de datos
});

dbConnection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

app.use(express.json());


// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM alumnos WHERE email = '${email}' AND password = '${password}'`;
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error('Error al verificar las credenciales:', err);
            res.status(500).send('Error al verificar las credenciales');
        } else {
            if (result.length > 0) {
                res.status(200).send('Inicio de sesión exitoso');
            } else {
                res.status(401).send('Credenciales inválidas');
            }
        }
    });
});

// Obtener todas las calificaciones
app.get('/calificaciones', (req, res) => {
    const query = 'SELECT * FROM calificaciones';
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener las calificaciones:', err);
            res.status(500).send('Error al obtener las calificaciones');
        } else {
            res.json(result);
        }
    });
});

// Obtener calificaciones por correo electrónico del usuario
app.get('/calificaciones/:email', (req, res) => {
    const email = req.params.email;
    const query = `
      SELECT * FROM calificaciones
      WHERE nControl IN (SELECT ncontrol FROM alumnos WHERE email = '${email}')
    `;
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener las calificaciones:', err);
            res.status(500).send('Error al obtener las calificaciones');
        } else {
            res.json(result);
        }
    });
});

// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
    const query = 'SELECT * FROM alumnos';
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los alumnos:', err);
            res.status(500).send('Error al obtener los alumnos');
        } else {
            res.json(result);
        }
    });
});

// Obtener todas las asignaturas
app.get('/asignaturas', (req, res) => {
    const query = 'SELECT * FROM asignaturas';
    dbConnection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener las asignaturas:', err);
            res.status(500).send('Error al obtener las asignaturas');
        } else {
            res.json(result);
        }
    });
});


app.use(express.static('public'))

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Servidor iniciado en  ${port}`);
})