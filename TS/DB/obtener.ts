import { IncomingMessage, ServerResponse } from "http";
import connection from "./db.js";
import { RowDataPacket } from "mysql2"; // ✅ Importar RowDataPacket

// 🔹 Obtener Películas
export function obtenerPeliculas(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");

    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }

    const query = `SELECT obtener_peliculas_por_tienda(?) AS peliculas`;

    connection.query<RowDataPacket[]>(query, [storeId], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error en la consulta" }));
            return;
        }

        if (!results || results.length === 0 || !("peliculas" in results[0])) {
            console.error("❌ No se encontraron películas.");
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "No se encontraron películas" }));
            return;
        }

        const peliculas = results[0].peliculas ? JSON.parse(results[0].peliculas as string) : [];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, peliculas }));
    });
}

// 🔹 Obtener Rentas
export function obtenerRentas(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");

    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }

    const query = `SELECT obtener_rentas_por_tienda(?) AS rentas`;

    connection.query<RowDataPacket[]>(query, [storeId], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error en la consulta" }));
            return;
        }

        if (!results || results.length === 0 || !("rentas" in results[0])) {
            console.error("❌ No se encontraron rentas.");
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "No se encontraron rentas" }));
            return;
        }

        const rentas = results[0].rentas ? JSON.parse(results[0].rentas as string) : [];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, rentas }));
    });
}

// 🔹 Obtener Empleados
export function obtenerEmpleados(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");

    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }

    const query = `SELECT obtener_empleados_por_tienda(?) AS empleados`;

    connection.query<RowDataPacket[]>(query, [storeId], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error en la consulta" }));
            return;
        }

        if (!results || results.length === 0 || !("empleados" in results[0])) {
            console.error("❌ No se encontraron empleados.");
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "No se encontraron empleados" }));
            return;
        }

        const empleados = results[0].empleados ? JSON.parse(results[0].empleados as string) : [];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, empleados }));
    });
}
