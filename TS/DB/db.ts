import mysql from "mysql2";

// 🔹 Configuración de conexión a MySQL
const connection = mysql.createConnection({
    host: "localhost", // IP de la VM 192.168.56.101
    user: "root",         // Usuario de MySQL rodrigo
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
