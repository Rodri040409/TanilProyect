import mysql from "mysql2";

// 🔹 Configuración de conexión a MySQL
const connection = mysql.createConnection({
    host: "192.168.56.101", // IP de la VM
    user: "rodrigo",         // Usuario de MySQL
    password: "root",        // Contraseña
    database: "sakila",      // Nombre de la BD
    port: 3306               // Puerto de MySQL
});

// 🔹 Intentar conectar
connection.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL en 192.168.56.101:3306");
});

export default connection;
