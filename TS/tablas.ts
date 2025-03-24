import { mostrarVistaEdicion, showMenuAndTables } from "./index.js";

export function createTablas(tipo: string = "Películas") {
    const tablas = document.createElement("div");
    tablas.classList.add("contenedorTablas");

    const storeId = localStorage.getItem("store_id");
    if (!storeId) {
        console.error("❌ No se encontró `store_id` en localStorage.");
        return tablas;
    }

    let endpoint = "peliculas";
    let columnas = ["Título", "Año", "Género"];
    let keys = ["titulo", "año", "género"];
    let tipoElemento = "pelicula";
    let idKey = "film_id";
    let detallesRuta = "pelicula";

    if (tipo === "Rentas") {
        endpoint = "rentas";
        columnas = ["Película", "Cliente", "Fecha Renta"];
        keys = ["pelicula", "cliente", "fecha_renta"];
        tipoElemento = "renta";
        idKey = "rental_id";
        detallesRuta = "renta";
    } else if (tipo === "Empleados") {
        endpoint = "empleados";
        columnas = ["Nombre", "Correo", "Usuario"];
        keys = ["nombre", "correo", "usuario"];
        tipoElemento = "empleado";
        idKey = "staff_id";
        detallesRuta = "empleado";
    }

    fetch(`http://localhost:4000/${endpoint}?store_id=${storeId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error(`❌ Error al obtener ${tipo}:`, data.message);
                return;
            }

            tablas.innerHTML = "";

            if (data[endpoint].length === 0) {
                tablas.innerHTML = `<p class="no-datos">No hay datos disponibles para ${tipo}.</p>`;
                return;
            }

            data[endpoint].forEach((item: any) => {
                const card = document.createElement("div");
                card.classList.add("card");

                const id = item[idKey];
                if (!id) return;

                // ❌ Parte visual normal
                const contenidoNormal = `
                    <div class="card">
                        <div class="card__title">${tipo}</div>
                        <div class="card__data">
                        <div class="card__right">
                            <div class="item">${columnas[0]}</div>
                            <div class="item">${columnas[1]}</div>
                            <div class="item">${columnas[2]}</div>
                        </div>
                        <div class="card__left">
                            <div class="item">${item[keys[0]] ?? "N/A"}</div>
                            <div class="item">${item[keys[1]] ?? "N/A"}</div>
                            <div class="item">${item[keys[2]] ?? "N/A"}</div>
                        </div>
                        </div>
                        <div class="actions">
                            <button class="button delete" data-id="${id}" data-tipo="${tipoElemento}">
                                <span class="button__text">Eliminar</span>
                                <span class="button__icon">
                                <svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                    <title></title>
                                    <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                                    <line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line>
                                    <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                                    <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line>
                                    <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line>
                                    <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line>
                                </svg>
                                </span>
                            </button>
                            <button class="button edit" type="button">
                                <span class="button__text">Editar</span>
                                <span class="button__icon">
                                <svg viewBox="0 0 512 512" class="svg">
                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" fill="white"></path>
                                </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                `;

                card.innerHTML = contenidoNormal;
                const deleteButton = card.querySelector(".delete") as HTMLButtonElement;

                deleteButton.addEventListener("click", () => {
                    fetch(`http://localhost:4000/${tipoElemento}?${idKey}=${id}`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.success) {
                                alert("❌ No se pudieron obtener los detalles.");
                                return;
                            }

                            const d = data[tipoElemento];
                            let mensaje = `⚠️ ¿Seguro que deseas eliminar esta ${tipo}?

`;

                            if (tipoElemento === "pelicula") {
                                mensaje += `🎬 Título: ${d.titulo}\n📅 Año: ${d.año}\n📜 Descripción: ${d.descripcion}\n🌍 Idioma: ${d.idioma}\n💰 Renta: $${d.renta}\n⭐ Rating: ${d.rating}\n🏷️ Duración de renta: ${d.duracion_renta} días\n🎥 Duración: ${d.duracion} min\n📀 Costo de reemplazo: $${d.costo_reemplazo}\n📦 Inventario total: ${d.inventario_total}\n✨ Características especiales: ${d.caracteristicas}`;
                            } else if (tipoElemento === "renta") {
                                mensaje += `🎬 Película: ${d.pelicula} (${d.año_pelicula})\n👤 Cliente: ${d.nombre_cliente} ${d.apellido_cliente}\n📧 ${d.email_cliente}\n📅 Fecha renta: ${d.rental_date}\n↩️ Fecha devolución: ${d.return_date}\n👔 Atendido por: ${d.empleado_nombre} ${d.empleado_apellido} (${d.usuario_empleado})\n💰 Total pagado: $${d.monto_total_pagado}`;
                            } else if (tipoElemento === "empleado") {
                                mensaje += `🆔 ID: ${d.staff_id}\n👤 Nombre: ${d.first_name} ${d.last_name}\n📧 Correo: ${d.email}\n👨‍💼 Usuario: ${d.username}`;
                            }

                            if (confirm(mensaje)) {
                                fetch(`http://localhost:4000/eliminar?tipo=${tipoElemento}&id=${id}&store_id=${storeId}`, {
                                    method: "DELETE",
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            alert("✅ Eliminado correctamente");
                                            location.reload();
                                        } else {
                                            alert("❌ Error al eliminar");
                                        }
                                    })
                                    .catch((error) => console.error("❌ Error:", error));
                            }
                        })
                        .catch(error => {
                            console.error("❌ Error al obtener detalles:", error);
                        });
                });

                // Botón Editar
                const editButton = card.querySelector(".edit") as HTMLButtonElement;
                editButton.addEventListener("click", () => {
                    fetch(`http://localhost:4000/${detallesRuta}?${idKey}=${id}`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.success) return alert("❌ No se pudieron obtener los detalles.");
                            const detalles = data[tipoElemento];

                            // 🧠 Campos extendidos solo para películas
                            const camposEditar = tipo === "Películas"
                            ? [
                                { key: "titulo", label: "Título" },
                                { key: "año", label: "Año" },
                                { key: "género", label: "Género" },
                                { key: "descripcion", label: "Descripción" },
                                { key: "idioma", label: "Idioma" },
                                { key: "renta", label: "Precio de Renta" },
                                { key: "rating", label: "Rating" },
                                { key: "duracion_renta", label: "Días de Renta" },
                                { key: "duracion", label: "Duración (min)" },
                                { key: "costo_reemplazo", label: "Costo de reemplazo" },
                                { key: "inventario_total", label: "Inventario total" },
                                { key: "caracteristicas", label: "Características" },
                            ]
                            : tipo === "Rentas"
                            ? [
                                { key: "pelicula", label: "Película" },
                                { key: "año_pelicula", label: "Año Película" },
                                { key: "nombre_cliente", label: "Nombre Cliente" },
                                { key: "apellido_cliente", label: "Apellido Cliente" },
                                { key: "email_cliente", label: "Correo Cliente" },
                                { key: "rental_date", label: "Fecha Renta" },
                                { key: "return_date", label: "Fecha Devolución" },
                                { key: "empleado_nombre", label: "Nombre Empleado" },
                                { key: "empleado_apellido", label: "Apellido Empleado" },
                                { key: "usuario_empleado", label: "Usuario Empleado" },
                                { key: "monto_total_pagado", label: "Total Pagado" }
                            ]
                            : [
                                { key: "staff_id", label: "ID" },
                                { key: "first_name", label: "Nombre" },
                                { key: "last_name", label: "Apellido" },
                                { key: "email", label: "Correo" },
                                { key: "username", label: "Usuario" }
                            ];                        

                        // 👉 Esto va dentro del fetch().then(...).then(data => { ... }) del botón editar
                        const editCard = document.createElement("div");
                        editCard.classList.add("contenedorTablas"); // contenedor principal como en la vista normal
                        editCard.innerHTML = `
                            <div class="card">
                                <div class="card__title">${tipo} - Editando</div>
                                <div class="card__data">
                                    <div class="card__right">
                                        ${camposEditar.map(c => `<div class="item">${c.label}</div>`).join("")}
                                    </div>
                                    <div class="card__left">
                                        ${camposEditar.map(c => `
                                            <div class="item">
                                                <input class="input-editar" data-key="${c.key}" value="${detalles[c.key] ?? ""}" />
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                                <div class="actions">
                                    <button class="button regresar">
                                        <span class="button__text">Regresar</span>
                                    </button>
                                    <button class="button actualizar">
                                        <span class="button__text">Actualizar</span>
                                    </button>
                                </div>
                            </div>
                        `;

                            // Botón regresar
                            editCard.querySelector(".regresar")?.addEventListener("click", () => {
                                showMenuAndTables();
                            });

                            // Botón actualizar
                            editCard.querySelector(".actualizar")?.addEventListener("click", () => {
                                const inputs = editCard.querySelectorAll<HTMLInputElement>(".input-editar");
                                const cambios: Record<string, string> = {};
                            
                                inputs.forEach(input => {
                                    const key = input.dataset.key;
                                    const nuevoValor = input.value.trim();
                                    const original = detalles[key ?? ""];
                            
                                    if (nuevoValor && nuevoValor !== original) {
                                        cambios[key ?? ""] = nuevoValor;
                                    }
                                });
                            
                                if (Object.keys(cambios).length === 0) {
                                    alert("⚠️ No hiciste ningún cambio.");
                                    return;
                                }

                                // Agrega este log justo antes del fetch
                                console.log("🛠 Enviando al backend:", {
                                    tipo: tipoElemento,
                                    id,
                                    cambios,
                                    extras: {
                                        customer_id: detalles.customer_id,
                                        staff_id: detalles.staff_id
                                    }
                                });

                                fetch("http://localhost:4000/actualizar", {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        tipo: tipoElemento,
                                        id,
                                        cambios,
                                        extras: {
                                            customer_id: detalles.customer_id,
                                            staff_id: detalles.staff_id
                                        }
                                    }),
                                })

                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            alert("✅ Actualización exitosa");
                                            location.reload();
                                        } else {
                                            alert("❌ Error al actualizar: " + data.message);
                                            console.error(data);
                                        }
                                    })
                                    .catch(error => {
                                        alert("❌ Error en la solicitud de actualización");
                                        console.error("❌ Error:", error);
                                    });
                            });                            

                            mostrarVistaEdicion(editCard);
                        });
                });

                tablas.appendChild(card);
            });
        })
        .catch(error => {
            console.error(`❌ Error en la solicitud de ${tipo}:`, error);
        });

    return tablas;
}
