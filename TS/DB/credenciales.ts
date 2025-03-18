import { IncomingMessage, ServerResponse } from "http";
import { RowDataPacket } from "mysql2";
import connection from "./db.js";

export function handleLogin(req: IncomingMessage, res: ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            console.log("📌 Datos recibidos:", body); // ✅ DEBUG

            const { username, password, store_id } = JSON.parse(body);

            if (!username || !password || !store_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Todos los campos son obligatorios" }));
                return;
            }

            // 🔹 Ejecutar la consulta a MySQL
            const query = `SELECT validar_login(?, ?, ?) AS login_valido`;
            connection.query<(RowDataPacket & { login_valido: number })[]>(
                query,
                [username, password, store_id],
                (err, results) => {
                    if (err) {
                        console.error("❌ Error en la consulta:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Error en el servidor" }));
                        return;
                    }

                    if (results.length === 0) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Credenciales incorrectas" }));
                        return;
                    }

                    const loginValido = results[0].login_valido === 1;
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: loginValido, message: loginValido ? "Inicio de sesión exitoso" : "Credenciales incorrectas" }));
                }
            );

        } catch (error) {
            console.error("❌ Error al procesar la solicitud:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error interno" }));
        }
    });
}
