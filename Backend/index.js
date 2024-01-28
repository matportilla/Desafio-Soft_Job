const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

// Inicia el servidor en el puerto 3000
app.listen(3000, console.log("Servidor operativo en puerto 3000"));

// Middleware de CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para imprimir registros de solicitud en la consola (morgan con formato 'dev')
app.use(morgan('dev'));

const { registerUser, verifyUser, profileView } = require('./services/queries');
const { report, verifyLogin, verifyToken } = require('./middleware/middlewares');

// RUTA: Registrar Usuario
app.post("/usuarios", report, async (req, res) => {
    try {
        const newUser = req.body;
        await registerUser(newUser);
        res.send('Usuario registrado con éxito');
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});

// RUTA: Iniciar sesión (Login)
app.post("/login", verifyLogin, report, async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await verifyUser(email, password);
        if (!result.error) {
            // Crear un token JWT con el correo electrónico como payload
            const token = jwt.sign({ email }, "Secret.key");
            console.log(token);
            res.send(token);
        } else {
            res.status(400).send(result.msg);
        }
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});

// RUTA: Obtener datos del usuario (requiere token de autenticación)
app.get("/usuarios", verifyToken, report, async (req, res) => {
    try {
        // Obtener el token de la cabecera de autorización
        const Authorization = req.header('Authorization');
        const token = Authorization.split("Bearer ")[1]; // Separar "Bearer" y el token
        // Verificar y extraer la información del correo electrónico del token
        const { email } = jwt.verify(token, 'Secret.key');
        
        // Obtener y enviar el perfil del usuario
        const profile = await profileView(email);
        res.send(profile);
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});
