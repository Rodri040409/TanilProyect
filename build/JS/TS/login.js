var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showMenuAndTables } from "./index.js";
export function createLogin() {
    console.log("🔹 createLogin() ejecutándose...");
    const login = document.createElement("div");
    login.classList.add("login-container");
    login.innerHTML = `
        <div class="contenedor">
            <form class="form">
                <div class="title">Bienvenido,<br><span>Inicie sesión para continuar</span></div>
                <input type="text" placeholder="Usuario" name="username" class="input">
                <input type="password" placeholder="Contraseña" name="password" class="input">
                <div class="mydict">
                    <div>
                        <label>
                            <input type="radio" name="store" value="1" checked>
                            <span>Tienda 1</span>
                        </label>
                        <label>
                            <input type="radio" name="store" value="2">
                            <span>Tienda 2</span>
                        </label>
                    </div>
                </div>
                <button type="submit" class="button-confirm">Iniciar sesión</button> 
            </form>
        </div>
    `;
    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ ERROR: No se encontró el elemento #app en el DOM.");
        return login;
    }
    app.appendChild(login);
    console.log("✅ Login agregado al DOM correctamente.");
    setTimeout(() => {
        const form = login.querySelector(".form");
        if (!form) {
            console.error("❌ ERROR: No se encontró el formulario dentro del login.");
            return;
        }
        console.log("✅ Formulario encontrado dentro del login.");
        form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            event.preventDefault();
            console.log("🔹 Formulario enviado");
            const username = (_a = form.querySelector("input[name='username']")) === null || _a === void 0 ? void 0 : _a.value.trim();
            const password = (_b = form.querySelector("input[name='password']")) === null || _b === void 0 ? void 0 : _b.value.trim();
            const store = (_c = form.querySelector("input[name='store']:checked")) === null || _c === void 0 ? void 0 : _c.value;
            if (!username || !password || !store) {
                alert("⚠️ Todos los campos son obligatorios.");
                return;
            }
            document.body.classList.add("glass-active");
            const minTime = 3000;
            const startTime = Date.now();
            let loginMessage = "";
            let isSuccess = false;
            try {
                console.log("🔹 Enviando solicitud al servidor...");
                const response = yield fetch("http://localhost:4000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, store_id: parseInt(store) }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = yield response.json();
                if (data.success) {
                    loginMessage = "✅ Inicio de sesión exitoso";
                    isSuccess = true;
                    localStorage.setItem("store_id", store);
                    console.log(`🔹 Número de tienda ${store} guardado en localStorage.`);
                }
                else {
                    loginMessage = "❌ Credenciales incorrectas";
                }
            }
            catch (error) {
                console.error("❌ Error en la solicitud:", error);
                loginMessage = "⚠️ Error al conectar con el servidor.";
            }
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minTime - elapsedTime);
            setTimeout(() => {
                document.body.classList.remove("glass-active");
                console.log("🔹 Glass overlay ocultado");
                alert(loginMessage);
                if (isSuccess) {
                    showMenuAndTables();
                }
            }, remainingTime);
        }));
    }, 500);
    console.log("📌 Login generado correctamente:", login.outerHTML);
    return login;
}
//# sourceMappingURL=login.js.map