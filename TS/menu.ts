import { logout, updateTablas, filtrarTablas } from "./index.js";

export function createMenu(): HTMLDivElement {
    const menu = document.createElement("div");
    menu.classList.add("menu-container");
    menu.innerHTML = `
            <div class="logOutContent">
                <button class="logOut">
                    <div class="sign">
                        <svg viewBox="0 0 512 512">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                    </div>
                    
                    <div class="text">Cerrar sesión</div>
                </button>  
            </div>

            <div class="contentNav">
                <div class="radio-inputs">
                    <label class="radio">
                        <input type="radio" name="radio" value="Películas" checked />
                        <span class="name">Películas</span>
                    </label>
                    <label class="radio">
                        <input type="radio" name="radio" value="Rentas" />
                        <span class="name">Rentas</span>
                    </label>
                    <label class="radio">
                        <input type="radio" name="radio" value="Empleados" />
                        <span class="name">Empleados</span>
                    </label>
                </div>

                <div class="buscadorContenedor">
                    <input
                        class="input buscador"
                        name="text"
                        type="text"
                        placeholder="Buscar..."
                    />
                </div>
            </div>
    `;

    // ✅ Aplicar estilo al <body> cuando el menú esté activo
    document.body.classList.add("background-Rayas");

    // ✅ Asegurar que #app tenga position: relative;
    const appElement = document.getElementById("app");
    if (appElement) {
        appElement.classList.add("relative");
    }

    // ✅ Agregar funcionalidad al botón de cerrar sesión con espera de 2s
    setTimeout(() => {
        const logoutBtn = menu.querySelector(".logOut");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                console.log("🔹 Botón de cerrar sesión clickeado. Esperando 2s...");
                setTimeout(() => {
                    logout();
                }, 2000);
            });
        } else {
            console.error("❌ No se encontró el botón de cerrar sesión.");
        }
    }, 100);

    // ✅ Detectar cambio en los radios y actualizar las tablas
    setTimeout(() => {
        const radios = menu.querySelectorAll(".radio-inputs input");
        radios.forEach((radio) => {
            radio.addEventListener("change", (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    console.log(`🔹 Cambio detectado: ${target.value}`);
                    updateTablas(target.value);
                }
            });
        });
    }, 100);

    // ✅ Funcionalidad del buscador
    setTimeout(() => {
        const buscador = menu.querySelector(".buscador") as HTMLInputElement;
        if (buscador) {
            buscador.addEventListener("input", () => filtrarTablas(buscador.value.trim().toLowerCase()));
        }
    }, 100);

    return menu;
}