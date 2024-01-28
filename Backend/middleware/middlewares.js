const jwt = require("jsonwebtoken");

// Middleware para registrar información de las solicitudes
const report = async (req, res, next) => {
    const params = req.params;
    const url = req.url;
    const body = req.body;

    // Registra en la consola información sobre la solicitud
    console.log(`${new Date()} - ${url} - ${body.email}`, params);

    // Continúa con el siguiente middleware
    next();
};

// Middleware para verificar la autenticidad del token en las solicitudes
const verifyToken = (req, res, next) => {
    try {
        // Extrae el token de las cabeceras de autorización
        const token = req.header('Authorization').split('Bearer ')[1];

        // Verifica si el token está presente
        if (!token) {
            throw { code: 401, message: 'Debe incluir el token en las cabeceras (Authorization)' };
        }

        // Verifica la validez del token utilizando la clave secreta
        const validToken = jwt.verify(token, "Secret.key");

        // Verifica si el token es válido
        if (!validToken) {
            throw { code: 401, message: "Token inválido" };
        }

        // Extrae la información del token decodificado
        const { email } = jwt.decode(token);

        // Registra en la consola el email del usuario que envió la solicitud
        console.log("Solicitud enviada por " + email);

        // Continúa con el siguiente middleware
        next();
    } catch (error) {
        // Maneja cualquier error y pasa al siguiente middleware (o middleware de manejo de errores)
        next(error);
    }
};

// Middleware para verificar la presencia de credenciales en las solicitudes de inicio de sesión
const verifyLogin = (req, res, next) => {
    const { email, password } = req.body;

    // Verifica si se proporcionaron credenciales
    if (!email || !password) {
        // Envía una respuesta de error si las credenciales son inválidas
        res.status(400).send({ message: "Credenciales inválidas" });
    } else {
        // Continúa con el siguiente middleware
        next();
    }
};

// Exporta los middleware para su uso en otras partes de la aplicación
module.exports = { report, verifyToken, verifyLogin };
