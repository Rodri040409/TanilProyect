import { createLogin } from "./login.js";
import { createLoader } from "./loader.js";
import { createMenu } from "./menu.js";
import { createTablas } from "./tablas.js";

/**
 * Función principal para iniciar la aplicación.
 */
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

        // ✅ Verificar si hay un usuario autenticado
        const storeId = localStorage.getItem("store_id");
        if (storeId) {
            console.log("✅ Usuario autenticado. Cargando menú y tablas...");
            showMenuAndTables();
        } else {
            console.log("🔹 Usuario no autenticado. Mostrando login...");
            app.appendChild(createLogin());
        }
    });
}

/**
 * Función para mostrar el menú y las tablas después de un login exitoso.
 */
export function showMenuAndTables() {
    console.log("🔹 Mostrando menú y tablas...");

    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ ERROR: No se encontró #app en el DOM.");
        return;
    }

    app.innerHTML = ""; // ✅ Limpiar el contenido previo

    app.appendChild(createMenu());

    // ✅ Cargar la vista inicial con "Películas" por defecto
    updateTablas("Películas");
}

/**
 * ✅ Función para actualizar las tablas según el tipo seleccionado en el menú.
 */
export function updateTablas(tipo: string) {
    console.log(`🔹 Cambiando tablas a: ${tipo}`);

    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ ERROR: No se encontró #app en el DOM.");
        return;
    }

    // ✅ Remover tablas previas
    const tablaExistente = document.querySelector(".contenedorTablas");
    if (tablaExistente) {
        tablaExistente.remove();
    }

    // ✅ Mostrar el loader ANTES de cargar los datos
    document.body.classList.add("glass-active");
    const loader = createLoader();
    app.appendChild(loader);

    // ✅ Definir el endpoint correcto
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

            // ✅ Crear las tablas con los datos obtenidos
            const tablasElement = createTablas(tipo);

            // ✅ Asegurar que el loader desaparece SOLO cuando la tabla se renderiza
            setTimeout(() => {
                loader.remove();
                document.body.classList.remove("glass-active");
                app.appendChild(tablasElement);
            }, 500); // Pequeño retraso para evitar cortes visuales
        })
        .catch(error => {
            console.error(`❌ Error en la solicitud de ${tipo}:`, error);
            loader.remove();
            document.body.classList.remove("glass-active");
        });
}

export function filtrarTablas(termino: string) {
    console.log(`🔍 Filtrando resultados con: "${termino}"`);

    const tarjetas = document.querySelectorAll(".card");

    tarjetas.forEach((tarjeta) => {
        const items = tarjeta.querySelectorAll(".card__left .item");

        // ✅ Verificar si la tarjeta coincide con el término de búsqueda
        const coincide = Array.from(items).some((item, index) => {
            const texto = item.textContent?.trim().toLowerCase() ?? "";
            return texto.includes(termino);
        });

        // ✅ Mostrar/Ocultar tarjetas según el resultado de la búsqueda
        if (coincide) {
            (tarjeta as HTMLElement).style.display = "block";
        } else {
            (tarjeta as HTMLElement).style.display = "none";
        }
    });
}

/**
 * ✅ Exportar `logout` para que pueda ser usado en `menu.ts`
 */
export function logout() {
    console.log("🔹 Cerrando sesión...");
    localStorage.removeItem("store_id"); // ✅ Eliminar el store_id
    window.location.reload(); // 🔄 Recargar la página para volver al login
}
