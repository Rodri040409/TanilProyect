import mysql from "mysql2";
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sakila",
    port: 3306
});
connection.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL en 192.168.56.101:3306");
});
export default connection;
//# sourceMappingURL=db.js.map