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
            const { tipo, id, cambios, extras } = datos;

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
                    cambios.año !== undefined ? parseInt(cambios.año) : null,
                    cambios.género ?? null,
                    cambios.descripcion ?? null,
                    cambios.idioma ?? null,
                    cambios.renta !== undefined ? parseFloat(cambios.renta) : null,
                    cambios.rating ?? null,
                    cambios.duracion_renta !== undefined ? parseInt(cambios.duracion_renta) : null,
                    cambios.duracion !== undefined ? parseInt(cambios.duracion) : null,
                    cambios.costo_reemplazo !== undefined ? parseFloat(cambios.costo_reemplazo) : null,
                    cambios.inventario_total !== undefined ? parseInt(cambios.inventario_total) : null,
                    cambios.caracteristicas ?? null,
                ];
            } else if (tipo === "renta") {
                sql = "SELECT actualizar_renta(?, ?, ?) AS resultado";
                const rentalDate = cambios.rental_date
                    ? new Date(cambios.rental_date).toISOString().slice(0, 19).replace("T", " ")
                    : null;

                const returnDate = cambios.return_date
                    ? new Date(cambios.return_date).toISOString().slice(0, 19).replace("T", " ")
                    : null;

                params = [
                    id,
                    rentalDate,
                    returnDate
                ];
            } else if (tipo === "empleado") {
                sql = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                params = [
                    id, // El ID del empleado
                    cambios.first_name ?? null,
                    cambios.last_name ?? null,
                    cambios.email ?? null,
                    cambios.username ?? null
                ];
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Tipo de entidad no reconocido" }));
                return;
            }

            // Ejecutar actualización principal
            connection.query(sql, params, (err, results) => {
                if (err) {
                    console.error("❌ Error en la base de datos:", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Error al actualizar en la base de datos" }));
                    return;
                }

                // Si tipo = renta, también actualizamos cliente y empleado si aplica
                if (tipo === "renta") {
                    const queries = [];

                    if (cambios.nombre_cliente || cambios.apellido_cliente || cambios.email_cliente) {
                        queries.push(new Promise((resolve, reject) => {
                            const q = "SELECT actualizar_cliente(?, ?, ?, ?) AS resultado";
                            const p = [
                                extras?.customer_id ?? null,
                                cambios.nombre_cliente ?? null,
                                cambios.apellido_cliente ?? null,
                                cambios.email_cliente ?? null
                            ];
                            connection.query(q, p, (err) => err ? reject(err) : resolve(true));
                        }));
                    }

                    if (cambios.empleado_nombre || cambios.empleado_apellido || cambios.usuario_empleado) {
                        queries.push(new Promise((resolve, reject) => {
                            const q = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                            const p = [
                                extras?.staff_id ?? null,
                                cambios.empleado_nombre ?? null,
                                cambios.empleado_apellido ?? null,
                                null, // email no editable desde renta
                                cambios.usuario_empleado ?? null
                            ];
                            connection.query(q, p, (err) => err ? reject(err) : resolve(true));
                        }));
                    }

                    Promise.all(queries)
                        .then(() => {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: true, message: "Actualizado correctamente" }));
                        })
                        .catch(error => {
                            console.error("❌ Error al actualizar datos relacionados:", error);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: false, message: "Error en datos relacionados" }));
                        });
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Actualizado correctamente" }));
                }
            });
        } catch (error) {
            console.error("❌ Error al procesar la solicitud:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Error en el formato del JSON" }));
        }
    });
}
