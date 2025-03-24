var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import connection from "./db.js";
export function actualizarElemento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                const datos = JSON.parse(body);
                const { tipo, id, cambios, extras } = datos;
                if (!tipo || !id || !cambios || typeof cambios !== "object") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Datos incompletos o inválidos" }));
                    return;
                }
                let sql = "";
                let params = [];
                if (tipo === "pelicula") {
                    sql = "SELECT actualizar_pelicula(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS resultado";
                    params = [
                        id,
                        (_a = cambios.titulo) !== null && _a !== void 0 ? _a : null,
                        cambios.año !== undefined ? parseInt(cambios.año) : null,
                        (_b = cambios.género) !== null && _b !== void 0 ? _b : null,
                        (_c = cambios.descripcion) !== null && _c !== void 0 ? _c : null,
                        (_d = cambios.idioma) !== null && _d !== void 0 ? _d : null,
                        cambios.renta !== undefined ? parseFloat(cambios.renta) : null,
                        (_e = cambios.rating) !== null && _e !== void 0 ? _e : null,
                        cambios.duracion_renta !== undefined ? parseInt(cambios.duracion_renta) : null,
                        cambios.duracion !== undefined ? parseInt(cambios.duracion) : null,
                        cambios.costo_reemplazo !== undefined ? parseFloat(cambios.costo_reemplazo) : null,
                        cambios.inventario_total !== undefined ? parseInt(cambios.inventario_total) : null,
                        (_f = cambios.caracteristicas) !== null && _f !== void 0 ? _f : null,
                    ];
                }
                else if (tipo === "renta") {
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
                }
                else if (tipo === "empleado") {
                    sql = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                    params = [
                        id,
                        (_g = cambios.first_name) !== null && _g !== void 0 ? _g : null,
                        (_h = cambios.last_name) !== null && _h !== void 0 ? _h : null,
                        (_j = cambios.email) !== null && _j !== void 0 ? _j : null,
                        (_k = cambios.username) !== null && _k !== void 0 ? _k : null
                    ];
                }
                else {
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
                    if (tipo === "renta") {
                        const queries = [];
                        if (cambios.nombre_cliente || cambios.apellido_cliente || cambios.email_cliente) {
                            queries.push(new Promise((resolve, reject) => {
                                var _a, _b, _c, _d;
                                const q = "SELECT actualizar_cliente(?, ?, ?, ?) AS resultado";
                                const p = [
                                    (_a = extras === null || extras === void 0 ? void 0 : extras.customer_id) !== null && _a !== void 0 ? _a : null,
                                    (_b = cambios.nombre_cliente) !== null && _b !== void 0 ? _b : null,
                                    (_c = cambios.apellido_cliente) !== null && _c !== void 0 ? _c : null,
                                    (_d = cambios.email_cliente) !== null && _d !== void 0 ? _d : null
                                ];
                                connection.query(q, p, (err) => err ? reject(err) : resolve(true));
                            }));
                        }
                        if (cambios.empleado_nombre || cambios.empleado_apellido || cambios.usuario_empleado) {
                            queries.push(new Promise((resolve, reject) => {
                                var _a, _b, _c, _d;
                                const q = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                                const p = [
                                    (_a = extras === null || extras === void 0 ? void 0 : extras.staff_id) !== null && _a !== void 0 ? _a : null,
                                    (_b = cambios.empleado_nombre) !== null && _b !== void 0 ? _b : null,
                                    (_c = cambios.empleado_apellido) !== null && _c !== void 0 ? _c : null,
                                    null,
                                    (_d = cambios.usuario_empleado) !== null && _d !== void 0 ? _d : null
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
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: true, message: "Actualizado correctamente" }));
                    }
                });
            }
            catch (error) {
                console.error("❌ Error al procesar la solicitud:", error);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Error en el formato del JSON" }));
            }
        });
    });
}
//# sourceMappingURL=enviar.js.map