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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            try {
                const datos = JSON.parse(body);
                const { tipo, id, cambios } = datos;
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
                        (_b = cambios.año) !== null && _b !== void 0 ? _b : null,
                        (_c = cambios.género) !== null && _c !== void 0 ? _c : null,
                        (_d = cambios.descripcion) !== null && _d !== void 0 ? _d : null,
                        (_e = cambios.idioma) !== null && _e !== void 0 ? _e : null,
                        (_f = cambios.renta) !== null && _f !== void 0 ? _f : null,
                        (_g = cambios.rating) !== null && _g !== void 0 ? _g : null,
                        (_h = cambios.duracion_renta) !== null && _h !== void 0 ? _h : null,
                        (_j = cambios.duracion) !== null && _j !== void 0 ? _j : null,
                        (_k = cambios.costo_reemplazo) !== null && _k !== void 0 ? _k : null,
                        (_l = cambios.inventario_total) !== null && _l !== void 0 ? _l : null,
                        (_m = cambios.caracteristicas) !== null && _m !== void 0 ? _m : null,
                    ];
                }
                else if (tipo === "renta") {
                    sql = "SELECT actualizar_renta(?, ?, ?) AS resultado";
                    params = [
                        id,
                        (_o = cambios.rental_date) !== null && _o !== void 0 ? _o : null,
                        (_p = cambios.return_date) !== null && _p !== void 0 ? _p : null,
                    ];
                }
                else if (tipo === "empleado") {
                    sql = "SELECT actualizar_empleado(?, ?, ?, ?, ?) AS resultado";
                    params = [
                        id,
                        (_q = cambios.first_name) !== null && _q !== void 0 ? _q : null,
                        (_r = cambios.last_name) !== null && _r !== void 0 ? _r : null,
                        (_s = cambios.email) !== null && _s !== void 0 ? _s : null,
                        (_t = cambios.username) !== null && _t !== void 0 ? _t : null,
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
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Actualizado correctamente" }));
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