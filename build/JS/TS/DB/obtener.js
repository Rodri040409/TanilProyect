import connection from "./db.js";
export function obtenerPeliculas(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");
    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }
    const query = `SELECT obtener_peliculas_por_tienda(?) AS peliculas`;
    connection.query(query, [storeId], (err, results) => {
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
        const peliculas = results[0].peliculas ? JSON.parse(results[0].peliculas) : [];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, peliculas }));
    });
}
export function obtenerRentas(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");
    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }
    const query = `SELECT obtener_rentas_por_tienda(?) AS rentas`;
    connection.query(query, [storeId], (err, results) => {
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
        const rentas = results[0].rentas ? JSON.parse(results[0].rentas) : [];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, rentas }));
    });
}
export function obtenerEmpleados(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const storeId = url.searchParams.get("store_id");
    if (!storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "store_id es requerido" }));
        return;
    }
    const query = `SELECT obtener_empleados_por_tienda(?) AS empleados`;
    connection.query(query, [storeId], (err, results) => {
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
        const empleados = results[0].empleados ? JSON.parse(results[0].empleados) : [];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, empleados }));
    });
}
export function obtenerDetallesAntesDeEliminar(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const tipo = url.searchParams.get("tipo");
    const id = url.searchParams.get("id");
    if (!tipo || !id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Faltan parámetros (tipo, id)" }));
        return;
    }
    let query = "";
    switch (tipo) {
        case "pelicula":
            query = `CALL obtener_pelicula(?)`;
            break;
        case "renta":
            query = `CALL obtener_renta(?)`;
            break;
        case "empleado":
            query = `CALL obtener_empleado(?)`;
            break;
        default:
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Tipo de consulta no válido" }));
            return;
    }
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error al obtener detalles" }));
            return;
        }
        if (!Array.isArray(results) || results.length === 0 || results[0].length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Elemento no encontrado" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, detalles: results[0][0] }));
    });
}
//# sourceMappingURL=obtener.js.map