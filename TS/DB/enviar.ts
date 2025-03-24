// db/enviar.ts
import { IncomingMessage, ServerResponse } from "http";
import connection from "./db.js";

export async function actualizarElemento(req: IncomingMessage, res: ServerResponse) {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const datos = JSON.parse(body);
            const { tipo, id, cambios } = datos;

            if (!tipo || !id || !cambios || typeof cambios !== "object") {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Datos incompletos o inválidos" }));
                return;
            }

            let sql = "";
            let params: any[] = [];

            if (tipo === "pelicula") {
                sql = "SELECT actualizar_pelicula(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS resultado";
                params = [
                    id,
                    cambios.titulo ?? null,
                    cambios.año ?? null,
                    cambios.género ?? null,
                    cambios.descripcion ?? null,
                    cambios.idioma ?? null,
                    cambios.renta ?? null,
                    cambios.rating ?? null,
                    cambios.duracion_renta ?? null,
                    cambios.duracion ?? null,
                    cambios.costo_reemplazo ?? null,
                    cambios.inventario_total ?? null,
                    cambios.caracteristicas ?? null,
                ];
            } else if (tipo === "renta") {
                sql = "SELECT actualizar_renta(?, ?, ?) AS resultado";
                params = [
                    id,
                    cambios.rental_date ?? null,
                    cambios.return_date ?? null,
                ];
            } else if (tipo === "empleado") {
                sql = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                params = [
                    id,
                    cambios.first_name ?? null,
                    cambios.last_name ?? null,
                    cambios.email ?? null,
                    cambios.username ?? null,
                ];
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Tipo de entidad no reconocido" }));
                return;
            }

            connection.query(sql, params, (err, results) => {
                if (err) {
                    console.error("❌ Error en la base de datos:", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Error al actualizar en la base de datos" }));
                    return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: "Actualizado correctamente" }));
            });
        } catch (error) {
            console.error("❌ Error al procesar la solicitud:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error en el formato del JSON" }));
        }
    });
}
