import http from "http";
import { handleLogin } from "./credenciales.js";
import { obtenerPeliculas, obtenerRentas, obtenerEmpleados, obtenerDetallesAntesDeEliminar } from "./obtener.js";
import { eliminarElemento } from "./eliminar.js";
import { actualizarElemento } from "./enviar.js";
import connection from "./db.js";
import { URL } from "url";
console.log("🚀 Servidor iniciando...");
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST = "0.0.0.0";
const server = http.createServer((req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.log(`📌 Solicitud recibida: ${req.method} ${req.url}`);
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "POST" && req.url === "/login") {
        handleLogin(req, res);
    }
    else if (req.method === "GET" && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/peliculas"))) {
        obtenerPeliculas(req, res);
    }
    else if (req.method === "GET" && ((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith("/rentas"))) {
        obtenerRentas(req, res);
    }
    else if (req.method === "GET" && ((_c = req.url) === null || _c === void 0 ? void 0 : _c.startsWith("/empleados"))) {
        obtenerEmpleados(req, res);
    }
    else if (req.method === "PATCH" && req.url === "/actualizar") {
        actualizarElemento(req, res);
    }
    else if (req.method === "GET" && ((_d = req.url) === null || _d === void 0 ? void 0 : _d.startsWith("/pelicula"))) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const filmId = parseInt(urlObj.searchParams.get("film_id") || "");
        if (isNaN(filmId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro film_id inválido" }));
            return;
        }
        connection.query("CALL obtener_pelicula(?)", [filmId], (err, results) => {
            var _a;
            if (err) {
                console.error("❌ Error al obtener película:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener película" }));
                return;
            }
            const pelicula = ((_a = results === null || results === void 0 ? void 0 : results[0]) === null || _a === void 0 ? void 0 : _a[0]) || null;
            if (!pelicula) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Película no encontrada" }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, pelicula }));
            }
        });
    }
    else if (req.method === "GET" && ((_e = req.url) === null || _e === void 0 ? void 0 : _e.startsWith("/renta"))) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const rentalId = parseInt(urlObj.searchParams.get("rental_id") || "");
        if (isNaN(rentalId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro rental_id inválido" }));
            return;
        }
        connection.query("CALL obtener_renta(?)", [rentalId], (err, results) => {
            var _a;
            if (err) {
                console.error("❌ Error al obtener renta:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener renta" }));
                return;
            }
            const renta = ((_a = results === null || results === void 0 ? void 0 : results[0]) === null || _a === void 0 ? void 0 : _a[0]) || null;
            if (!renta) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Renta no encontrada" }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, renta }));
            }
        });
    }
    else if (req.method === "GET" && ((_f = req.url) === null || _f === void 0 ? void 0 : _f.startsWith("/empleado"))) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const staffId = parseInt(urlObj.searchParams.get("staff_id") || "");
        if (isNaN(staffId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Parámetro staff_id inválido" }));
            return;
        }
        connection.query("CALL obtener_empleado(?)", [staffId], (err, results) => {
            var _a;
            if (err) {
                console.error("❌ Error al obtener empleado:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error al obtener empleado" }));
                return;
            }
            const empleado = ((_a = results === null || results === void 0 ? void 0 : results[0]) === null || _a === void 0 ? void 0 : _a[0]) || null;
            if (!empleado) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Empleado no encontrado" }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, empleado }));
            }
        });
    }
    else if (req.method === "GET" && ((_g = req.url) === null || _g === void 0 ? void 0 : _g.startsWith("/detalles"))) {
        obtenerDetallesAntesDeEliminar(req, res);
    }
    else if (req.method === "DELETE" && ((_h = req.url) === null || _h === void 0 ? void 0 : _h.startsWith("/eliminar"))) {
        eliminarElemento(req, res);
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
    }
});
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Error: El puerto ${PORT} ya está en uso en ${HOST}.`);
        process.exit(1);
    }
    else {
        throw err;
    }
});
server.listen(PORT, HOST, () => {
    console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
});
//# sourceMappingURL=server.js.map