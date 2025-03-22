import http from "http";
import { handleLogin } from "./credenciales.js";
import { obtenerPeliculas, obtenerRentas, obtenerEmpleados, obtenerDetallesAntesDeEliminar } from "./obtener.js"; 
import { eliminarElemento } from "./eliminar.js"; 

console.log("🚀 Servidor iniciando...");

// 🔹 Definir puerto e IP
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST: string = "0.0.0.0"; // Permitir conexiones en todas las interfaces

// 🔹 Crear el servidor HTTP
const server = http.createServer((req, res) => {
    console.log(`📌 Solicitud recibida: ${req.method} ${req.url}`); // ✅ DEBUG

    // 🔹 Manejar preflight request (CORS)
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    // 🔹 Agregar CORS a todas las respuestas
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 🔹 Rutas disponibles
    if (req.method === "POST" && req.url === "/login") {
        handleLogin(req, res);  // ✅ Llamar a la función de login
    } else if (req.method === "GET" && req.url?.startsWith("/peliculas")) {  
        obtenerPeliculas(req, res); // ✅ Obtener películas
    } else if (req.method === "GET" && req.url?.startsWith("/rentas")) {  
        obtenerRentas(req, res); // ✅ Obtener rentas
    } else if (req.method === "GET" && req.url?.startsWith("/empleados")) {  
        obtenerEmpleados(req, res); // ✅ Obtener empleados
    } else if (req.method === "GET" && req.url?.startsWith("/detalles")) {  
        obtenerDetallesAntesDeEliminar(req, res); // ✅ Obtener detalles antes de eliminar
    } else if (req.method === "DELETE" && req.url?.startsWith("/eliminar")) {  
        eliminarElemento(req, res); // ✅ Manejar eliminaciones
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Ruta no encontrada" }));
    }    
});

// 🔹 Manejo de errores en el servidor
server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Error: El puerto ${PORT} ya está en uso en ${HOST}.`);
        process.exit(1);
    } else {
        throw err;
    }
});

// 🔹 Iniciar el servidor en el puerto 4000
server.listen(PORT, HOST, () => {
    console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
});
