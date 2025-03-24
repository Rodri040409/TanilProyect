import http from "http";
import { handleLogin } from "./credenciales.js";
import {
    obtenerPeliculas,
    obtenerRentas,
    obtenerEmpleados,
    obtenerDetallesAntesDeEliminar
} from "./obtener.js";
import { eliminarElemento } from "./eliminar.js";
import { actualizarElemento } from "./enviar.js";
import connection from "./db.js";
import { RowDataPacket } from "mysql2";
import { URL } from "url";

console.log("🚀 Servidor iniciando...");

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST = "0.0.0.0";

const server = http.createServer((req, res) => {
    console.log(`📌 Solicitud recibida: ${req.method} ${req.url}`);

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 🔹 RUTAS PARA LISTADOS (frontend espera estas rutas)
    if (req.method === "POST" && req.url === "/login") {
        handleLogin(req, res);
    } else if (req.method === "GET" && req.url?.startsWith("/peliculas")) {
        obtenerPeliculas(req, res);
    } else if (req.method === "GET" && req.url?.startsWith("/rentas")) {
        obtenerRentas(req, res);
    } else if (req.method === "GET" && req.url?.startsWith("/empleados")) {
        obtenerEmpleados(req, res);
    } else if (req.method === "PATCH" && req.url === "/actualizar") {
        actualizarElemento(req, res);
    }

    // 🔹 RUTAS DETALLADAS (para mostrar en alertas antes de eliminar)
    else if (req.method === "GET" && req.url?.startsWith("/pelicula")) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const filmId = parseInt(urlObj.searchParams.get("film_id") || "");

        if (isNaN(filmId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro film_id inválido" }));
            return;
        }

        connection.query<RowDataPacket[][]>("CALL obtener_pelicula(?)", [filmId], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener película:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener película" }));
                return;
            }

            const pelicula = results?.[0]?.[0] || null;

            if (!pelicula) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Película no encontrada" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, pelicula }));
            }
        });
    }

    else if (req.method === "GET" && req.url?.startsWith("/renta")) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const rentalId = parseInt(urlObj.searchParams.get("rental_id") || "");

        if (isNaN(rentalId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro rental_id inválido" }));
            return;
        }

        connection.query<RowDataPacket[][]>("CALL obtener_renta(?)", [rentalId], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener renta:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener renta" }));
                return;
            }

            const renta = results?.[0]?.[0] || null;

            if (!renta) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Renta no encontrada" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, renta }));
            }
        });
    }

    else if (req.method === "GET" && req.url?.startsWith("/empleado")) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const staffId = parseInt(urlObj.searchParams.get("staff_id") || "");

        if (isNaN(staffId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro staff_id inválido" }));
            return;
        }

        connection.query<RowDataPacket[][]>("CALL obtener_empleado(?)", [staffId], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener empleado:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener empleado" }));
                return;
            }

            const empleado = results?.[0]?.[0] || null;

            if (!empleado) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Empleado no encontrado" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, empleado }));
            }
        });
    }

    // 🔹 Resto de rutas
    else if (req.method === "GET" && req.url?.startsWith("/detalles")) {
        obtenerDetallesAntesDeEliminar(req, res);
    } else if (req.method === "DELETE" && req.url?.startsWith("/eliminar")) {
        eliminarElemento(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
    }
});

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Error: El puerto ${PORT} ya está en uso en ${HOST}.`);
        process.exit(1);
    } else {
        throw err;
    }
});

server.listen(PORT, HOST, () => {
    console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
});
