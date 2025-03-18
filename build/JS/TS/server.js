var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
import mysql from "mysql2/promise";
const dbConfig = {
    host: "192.168.56.101",
    user: "rodrigo",
    password: "root",
    database: "sakila",
    port: 3306
};
const server = http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (req.url === "/test-db" && req.method === "GET") {
        try {
            const connection = yield mysql.createConnection(dbConfig);
            const [rows] = yield connection.query("SELECT NOW() as now;");
            connection.end();
            const serverTime = (_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.now) !== null && _b !== void 0 ? _b : "Fecha no disponible";
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Conexión exitosa", server_time: serverTime }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error conectando a la base de datos", details: errorMessage }));
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
}));
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map