export function createMain() {
    console.log("📌 main.ts: Generando el contenido del main...");
    
    const main = document.createElement("main");
    main.innerHTML = `
        <main>
            <h1>Bienvenidoo al Catálogo de InviteNow</h1>
            <p>Explora nuestras invitaciones personalizadas para cualquier ocasión.</p>
            <h3 class="text-3xl font-bold text-blue-500">Hola Tailwind CSS</h>
        </main>
    `;

    return main;
}
