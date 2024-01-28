const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'i0g4m0a1',
    database: 'softjobs',
    port: '5432',
    allowExitOnIdle: true
});

// Función para registrar un nuevo usuario en la base de datos
const registerUser = async (user) => {
    const { email, password, rol, lenguage } = user;

    try {
        // Encripta la contraseña antes de almacenarla en la base de datos
        const passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        
        // Consulta SQL para insertar el nuevo usuario en la base de datos y devuelve el usuario registrado
        const query = "INSERT INTO usuarios(email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [email, passwordEncrypted, rol, lenguage];
        const result = await pool.query(query, values);

        // Registra al nuevo usuario si es necesario
        console.log("Usuario registrado:", result.rows[0]);
        return { error: false, msg: "Usuario registrado correctamente" };
    } catch (error) {
        // Maneja errores al intentar registrar un usuario
        console.error("Error al registrar el usuario:", error.message);
        return { error: true, msg: "Hubo un error al registrar el usuario" };
    }
};

// Función para verificar las credenciales de un usuario durante el inicio de sesión
const verifyUser = async (email, password) => {
    try {
        // Consulta SQL para obtener el usuario con el correo electrónico proporcionado
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const values = [email];
        const result = await pool.query(query, values);

        if (result.rowCount === 1) {
            const dbPassword = result.rows[0].password;
            
            // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
            const correctPassword = bcrypt.compareSync(password, dbPassword);

            if (correctPassword) {
                console.log("Usuario validado");
                return { error: false, msg: "Usuario correcto" };
            } else {
                console.log("Contraseña incorrecta");
                return { error: true, msg: "Usuario o contraseña inválido" };
            }
        } else {
            console.log("Usuario no encontrado");
            return { error: true, msg: "Usuario o contraseña inválido" };
        }
    } catch (error) {
        // Maneja errores al intentar verificar un usuario
        console.error("Error al verificar el usuario:", error.message);
        return { error: true, msg: "Hubo un error inesperado" };
    }
};

// Función para obtener el perfil de un usuario según su correo electrónico
const profile = async (email) => {
    try {
        // Consulta SQL para obtener el perfil del usuario con el correo electrónico proporcionado
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const values = [email];
        const result = await pool.query(query, values);

        if (result.rowCount === 1) {
            // Obtiene y muestra el perfil del usuario
            const userProfile = result.rows[0];
            console.log("Perfil de usuario:", userProfile);
            return userProfile;
        } else {
            console.log("Usuario no encontrado");
            return null; // Retorna null o maneja según sea apropiado
        }
    } catch (error) {
        // Maneja errores al intentar obtener el perfil de un usuario
        console.error("Error al obtener el perfil del usuario:", error.message);
        throw new Error("Hubo un error al obtener el perfil del usuario");
    }
};

// Exporta las funciones para su uso en otros módulos
module.exports = { registerUser, verifyUser, profile };
