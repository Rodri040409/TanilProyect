import http from "http";
import { handleLogin } from "./credenciales.js";
import { obtenerPeliculas, obtenerRentas, obtenerEmpleados } from "./obtener.js";
console.log("🚀 Servidor iniciando...");
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST = "0.0.0.0";
const server = http.createServer((req, res) => {
    var _a, _b, _c;
    console.log(`📌 Solicitud recibida: ${req.method} ${req.url}`);
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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