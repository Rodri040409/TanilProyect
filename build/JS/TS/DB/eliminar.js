import connection from "./db.js";
export function eliminarElemento(req, res) {
    if (req.method !== "DELETE") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Método no permitido" }));
        return;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const tipo = url.searchParams.get("tipo");
    const id = url.searchParams.get("id");
    const storeId = url.searchParams.get("store_id");
    if (!tipo || !id || !storeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Faltan parámetros (tipo, id, store_id)" }));
        return;
    }
    let query = "";
    let params = [];
    switch (tipo) {
        case "pelicula":
            query = `CALL eliminar_pelicula(?, ?);`;
            params = [id, storeId];
            break;
        case "renta":
            query = `CALL eliminar_renta(?, ?);`;
            params = [id, storeId];
            break;
        case "empleado":
            query = `CALL eliminar_empleado(?, ?);`;
            params = [id, storeId];
            break;
        default:
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Tipo de eliminación no válido" }));
            return;
    }
    connection.query(query, [id, storeId], (err, results) => {
        if (err) {
            console.error("❌ Error en la consulta SQL:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error al eliminar el elemento", error: err }));
            return;
        }
        if (results.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "No se encontró el elemento para eliminar." }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Elemento eliminado correctamente" }));
    });
}
//# sourceMappingURL=eliminar.js.map