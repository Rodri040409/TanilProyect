import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve"; // 👈 Agregar esto

export default {
    input: "TS/index.ts",
    output: {
        dir: "build/JS",
        format: "es",
        sourcemap: true
    },
    plugins: [
        resolve(), // 👈 Esto ayuda a resolver `tslib`
        typescript({
            tsconfig: "./tsconfig.json"
        })
    ]
};
