import { createLogin } from "./login.js";
import { createLoader } from "./loader.js";
import { createMenu } from "./menu.js";
import { createTablas } from "./tablas.js";
export function startApp() {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("📌 index.ts: DOM completamente cargado.");
        const app = document.getElementById("app");
        if (!app) {
            console.error("❌ ERROR: No se encontró el contenedor #app.");
            return;
        }
        app.innerHTML = "";
        app.appendChild(createLoader());
        const storeId = localStorage.getItem("store_id");
        if (storeId) {
            console.log("✅ Usuario autenticado. Cargando menú y tablas...");
            showMenuAndTables();
        }
        else {
            console.log("🔹 Usuario no autenticado. Mostrando login...");
            app.appendChild(createLogin());
        }
    });
}
export function showMenuAndTables() {
    console.log("🔹 Mostrando menú y tablas...");
    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ ERROR: No se encontró #app en el DOM.");
        return;
    }
    app.innerHTML = "";
    app.appendChild(createMenu());
    updateTablas("Películas");
}
export function updateTablas(tipo) {
    console.log(`🔹 Cambiando tablas a: ${tipo}`);
    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ ERROR: No se encontró #app en el DOM.");
        return;
    }
    const tablaExistente = document.querySelector(".contenedorTablas");
    if (tablaExistente) {
        tablaExistente.remove();
    }
    document.body.classList.add("glass-active");
    const loader = createLoader();
    app.appendChild(loader);
    const endpoint = tipo === "Películas" ? "peliculas" : tipo === "Rentas" ? "rentas" : "empleados";
    fetch(`http://localhost:4000/${endpoint}?store_id=${localStorage.getItem("store_id")}`)
        .then(response => response.json())
        .then(data => {
        if (!data.success) {
            console.error(`❌ Error al obtener ${tipo}:`, data.message);
            loader.remove();
            document.body.classList.remove("glass-active");
            return;
        }
        console.log(`✅ ${tipo} obtenidos:`, data[endpoint]);
        const tablasElement = createTablas(tipo);
        setTimeout(() => {
            loader.remove();
            document.body.classList.remove("glass-active");
            app.appendChild(tablasElement);
        }, 500);
    })
        .catch(error => {
        console.error(`❌ Error en la solicitud de ${tipo}:`, error);
        loader.remove();
        document.body.classList.remove("glass-active");
    });
}
export function filtrarTablas(termino) {
    console.log(`🔍 Filtrando resultados con: "${termino}"`);
    const tarjetas = document.querySelectorAll(".card");
    tarjetas.forEach((tarjeta) => {
        const items = tarjeta.querySelectorAll(".card__left .item");
        const coincide = Array.from(items).some((item, index) => {
            var _a, _b;
            const texto = (_b = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
            return texto.includes(termino);
        });
        if (coincide) {
            tarjeta.style.display = "block";
        }
        else {
            tarjeta.style.display = "none";
        }
    });
}
export function logout() {
    console.log("🔹 Cerrando sesión...");
    localStorage.removeItem("store_id");
    window.location.reload();
}
//# sourceMappingURL=index.js.map