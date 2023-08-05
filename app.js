const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;
require('dotenv').config();
const mysql = require('mysql2');

// Configurar la conexión a la base de datos MySQL en la nube
const dbConfig = {
    host: 'by9wewrbsgh2joxudcpi-mysql.services.clever-cloud.com',
    user: 'uy44aub6lptawz2c',
    password: '4t03eIWNHgChQqYtypHF',
    database: 'by9wewrbsgh2joxudcpi', // Cambia esto al nombre de tu base de datos
  };

// Crear la conexión a la base de datos
const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        console.log(variables.env.DB_HOST, variables.env.DB_USER, variables.env.DB_PASSWORD, variables.env.DB_DATABASE)
    } else {
        console.log('Conexión a la base de datos exitosa!');
    }
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Asegúrate de enviar email y password en el cuerpo de la solicitud

    // Verificar las credenciales en la base de datos
    const query = `SELECT * FROM alumnos WHERE email = '${email}' AND password = '${password}'`;
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al verificar las credenciales:', err);
            res.status(500).send('Error al verificar las credenciales');
        } else {
            if (result.length > 0) {
                // Credenciales válidas, iniciar sesión y generar una sesión (por ejemplo, con una cookie)
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
    connection.query(query, (err, result) => {
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
    connection.query(query, (err, result) => {
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
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los alumnos:', err);
            res.status(500).send('Error al obtener los alumnos');
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