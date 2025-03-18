var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mysql from "mysql2/promise";
const dbConfig = {
    host: "192.168.56.101",
    user: "tu_usuario",
    password: "tu_contraseña",
    database: "tu_base_de_datos",
    port: 3306
};
export function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield mysql.createConnection(dbConfig);
            console.log("✅ Conexión a MySQL establecida correctamente.");
            return connection;
        }
        catch (error) {
            console.error("❌ Error conectando a MySQL:", error);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=database.js.map