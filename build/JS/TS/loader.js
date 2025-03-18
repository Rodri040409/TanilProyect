export function createLoader() {
    const loader = document.createElement("div");
    loader.innerHTML = `
        <div class="glass-overlay">
            <div class="ui-abstergo">
                <div class="abstergo-loader">
                <div></div>
                <div></div>
                <div></div>
                </div>
                <div class="ui-text">
                Validando credenciales
                <div class="ui-dot"></div>
                <div class="ui-dot"></div>
                <div class="ui-dot"></div>
                </div>
            </div>
        </div>
    `;
    return loader;
}
//# sourceMappingURL=loader.js.map