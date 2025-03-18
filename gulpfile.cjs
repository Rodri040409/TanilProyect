const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const newer = require("gulp-newer");
const ffmpeg = require("fluent-ffmpeg");
const through2 = require("through2");
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const readline = require("readline");
const browserSync = require("browser-sync").create();
const { exec } = require("child_process");

// 📌 **Compilar y Minificar CSS**
function css() {
    return src("src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/css"))
        .on("end", () => console.log("✅ CSS compilado y optimizado."));
}

// 📌 **Minificar y Copiar JavaScript**
function javascript() {
    return src("src/JS/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/JS"))
        .on("end", () => console.log("✅ JavaScript minificado y copiado."));
}

// 📌 **Optimizar Imágenes y Convertir a WebP, AVIF, JPG o PNG**
async function convertirFormato() {
    const webp = (await import("gulp-webp")).default;
    const avif = (await import("gulp-avif")).default;

    return src("recursos/imagenes/**/*.{jpg,jpeg,png,webp,avif,heic,gif,svg}") // Incluir SVG
        .pipe(newer("build/img")) // Solo procesa imágenes nuevas
        .pipe(
            through2.obj(async (file, _, cb) => {
                try {
                    // 📌 Pasar los archivos SVG directamente sin modificar
                    if (file.extname.toLowerCase() === '.svg') {
                        console.log(`✔️ Pasando archivo SVG directamente: ${file.path}`);
                        cb(null, file);
                        return;
                    }

                    // Procesar la imagen con sharp
                    const metadata = await sharp(file.contents).metadata();
                    let nuevaImagen = sharp(file.contents);
                    let buffer;
                    let calidad = 80;
                    const tieneTransparencia = metadata.hasAlpha;

                    // 🔹 Si tiene transparencia -> Convertir a PNG8
                    if (tieneTransparencia) {
                        console.log(`🔹 Convirtiendo ${file.path} a PNG8 (con transparencia detectada).`);
                        nuevaImagen = nuevaImagen.png({ palette: true, compressionLevel: 9 });
                        file.extname = '.png';
                    } else {
                        // 🔹 Si NO tiene transparencia -> Convertir a JPG
                        console.log(`🔹 Convirtiendo ${file.path} a JPG (sin transparencia detectada).`);
                        nuevaImagen = nuevaImagen.jpeg({ quality: calidad, progressive: true });
                        file.extname = '.jpg';
                    }

                    // Optimización inicial
                    buffer = await nuevaImagen.toBuffer();
                    let fileSizeInMB = buffer.length / (1024 * 1024);

                    // 🔥 Reducir calidad iterativamente si sigue pesando más de 1MB, pero nunca bajar de 50
                    while (fileSizeInMB > 1 && calidad > 50) {
                        calidad -= 5;
                        console.log(`⚠️ Bajando calidad a ${calidad} para reducir tamaño de ${file.path} (${fileSizeInMB.toFixed(2)} MB).`);
                        nuevaImagen = tieneTransparencia
                            ? sharp(buffer).png({ palette: true, compressionLevel: 9 })
                            : sharp(buffer).jpeg({ quality: calidad, progressive: true });
                        buffer = await nuevaImagen.toBuffer();
                        fileSizeInMB = buffer.length / (1024 * 1024);
                    }

                    // 📌 Si sigue pesando más de 1MB, reducir la resolución ligeramente
                    let nuevoAncho = metadata.width;
                    if (fileSizeInMB > 1) {
                        console.log(`⚠️ Redimensionando imagen para reducir tamaño de ${file.path}`);
                        while (fileSizeInMB > 1 && nuevoAncho > 500) {
                            nuevoAncho = Math.floor(nuevoAncho * 0.9); // Reducir en pasos del 10%
                            buffer = await sharp(buffer).resize({ width: nuevoAncho }).toBuffer();
                            fileSizeInMB = buffer.length / (1024 * 1024);
                        }
                    }

                    // Asignar el buffer optimizado al archivo
                    file.contents = buffer;
                    cb(null, file); // Continuar con el archivo procesado

                } catch (error) {
                    console.error(`❌ Error al procesar la imagen: ${file.path}. Error: ${error.message}`);
                    cb(null, file); // No interrumpir el proceso
                }
            })
        )
        .pipe(dest("build/img")) // Guardar imágenes optimizadas en build/img
        .on("end", () => {
            console.log("✅ Imágenes optimizadas. Iniciando conversión a WebP y AVIF en paralelo...");
            Promise.all([convertirWebP(), convertirAVIF()]) // Ejecutar en paralelo
                .then(() => console.log("✅ Conversión a WebP y AVIF completada."))
                .catch((err) => console.error("❌ Error en la conversión a WebP o AVIF:", err));
        });
}

// 📌 **Conversión a WebP en paralelo**
async function convertirWebP() {
    const webp = (await import("gulp-webp")).default;

    return new Promise((resolve, reject) => {
        src("build/img/**/*.{jpg,png}") // Solo tomar imágenes optimizadas
            .pipe(webp({ quality: 80 })
                .on("error", (err) => {
                    console.warn(`⚠️ Error en WebP: ${err.message}`);
                    reject(err);
                })
            )
            .pipe(dest("build/img"))
            .on("end", () => {
                console.log("✅ Conversión a WebP completada.");
                resolve();
            });
    });
}

// 📌 **Conversión a AVIF en paralelo**
async function convertirAVIF() {
    const avif = (await import("gulp-avif")).default;

    return new Promise((resolve, reject) => {
        src("build/img/**/*.{jpg,png}") // Solo tomar imágenes optimizadas
            .pipe(avif({ quality: 70 })
                .on("error", (err) => {
                    console.warn(`⚠️ Error en AVIF: ${err.message}`);
                    reject(err);
                })
            )
            .pipe(dest("build/img"))
            .on("end", () => {
                console.log("✅ Conversión a AVIF completada.");
                resolve();
            });
    });
}

// 📌 **Convertir Videos y Crear WebM y OGG**
async function convertirVideos() {
    const procesos = [];
    const gifDir = "build/gif";

    // Crear la carpeta para los GIFs si no existe
    await fs.mkdir(gifDir, { recursive: true });

    return src("recursos/videos/**/*.{mp4,mov,mkv,avi,flv,wmv,ogv}")
        .pipe(newer("build/videos"))
        .pipe(
            through2.obj(async (file, _, cb) => {
                const inputPath = file.path;
                const outputDir = "build/videos/";
                const baseName = path.basename(inputPath, path.extname(inputPath));

                // 🔹 Convertir video a MP4 optimizado primero
                const optimizadoMP4 = `${outputDir}${baseName}-optimized.mp4`;

                procesos.push(
                    new Promise((res, rej) => {
                        ffmpeg(inputPath)
                            .output(optimizadoMP4)
                            .videoCodec('libx264')
                            .outputOptions(["-crf 24", "-preset slow", "-vf scale=1280:-1", "-r 30"])  // Optimización de video MP4
                            .on("end", res)
                            .on("error", (err, stdout, stderr) => {
                                console.error(`⚠️ Error al optimizar el video: ${file.path}`);
                                console.error(`stderr: ${stderr}`);
                                console.error(`stdout: ${stdout}`);
                                rej(err);
                            })
                            .run();
                    })
                );

                // 🔹 Convertir a WebM y OGG a partir del MP4 optimizado
                const webmPath = `${outputDir}${baseName}.webm`;
                const oggPath = `${outputDir}${baseName}.ogg`;

                procesos.push(
                    new Promise((res, rej) => {
                        ffmpeg(optimizadoMP4)
                            .output(webmPath)
                            .videoCodec("libvpx-vp9")
                            .outputOptions(["-crf 35", "-b:v 200k"])
                            .on("end", res)
                            .on("error", (err, stdout, stderr) => {
                                console.warn(`⚠️ Error al convertir a WebM: ${file.path}`);
                                console.error(`stderr: ${stderr}`);
                                console.error(`stdout: ${stdout}`);
                                rej(err);
                            })
                            .run();
                    })
                );

                procesos.push(
                    new Promise((res, rej) => {
                        ffmpeg(optimizadoMP4)
                            .output(oggPath)
                            .videoCodec("libtheora")
                            .outputOptions(["-qscale .1"])
                            .on("end", res)
                            .on("error", (err, stdout, stderr) => {
                                console.warn(`⚠️ Error al convertir a OGG: ${file.path}`);
                                console.error(`stderr: ${stderr}`);
                                console.error(`stdout: ${stdout}`);
                                rej(err);
                            })
                            .run();
                    })
                );

                cb(null, file);
            })
        )
        .on("end", async () => {
            try {
                await Promise.all(procesos);
                console.log("✅ Videos convertidos correctamente.");
            } catch (error) {
                console.warn("⚠️ Algunos archivos fallaron.");
            }
        });
}

// 📌 **Mover los Archivos de Audio**
async function moverAudios() {
    return src("recursos/audios/**/*")
        .pipe(newer("build/audios"))
        .pipe(dest("build/audios"))
}

// 📌 **Minificar Archivos HTML**
function minificarHTML() {
    return src(["**/*.html", "!node_modules/**"])  // Excluimos la carpeta node_modules
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest("produccion"))  // Mover los archivos minificados directamente a produccion
        .on("end", () => console.log("✅ Archivos HTML minificados."));
}

// 📌 **Crear Carpeta Producción con Archivos Minificados**
async function produccion() {
    await fs.mkdir("produccion/build", { recursive: true });

    return src(["build/**/*", "!build/**/*.map", "!build/img/errors/**"])
        .pipe(dest("produccion/build"))  // Mover todo lo de build a produccion/build
        .on("end", () => {
            console.log("✅ Archivos optimizados copiados a producción.");
        });
}

// 📌 **Compilar TypeScript en un solo archivo (`index.js`)**
function compileTypescript(cb) {
    exec("tsc", (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Error en TypeScript:", stderr);
            cb(err);
            return;
        }
        console.log("✅ TypeScript compilado correctamente en build/JS/index.js");
        cb();
    });
}

// 📌 **Ejecutar TypeScript en modo "watch" para cambios en tiempo real**
function watchTypescript(cb) {
    const tscProcess = exec("tsc --watch");

    tscProcess.stdout.on("data", (data) => console.log(data));
    tscProcess.stderr.on("data", (data) => console.error(`❌ Error en TypeScript: ${data}`));

    cb();
}

// 📌 **Inicializar Servidor con BrowserSync**
function server() {
    browserSync.init({
        server: {
            baseDir: "./html",
        },
        notify: false,
        online: true,
    });

    watch("src/scss/**/*.scss", css);
    watch("src/JS/**/*.js", javascript);
    watch("html/**/*.html").on("change", browserSync.reload);
}

// 📌 **Ejecutar Gulp en modo desarrollo (CSS, JS y TS en paralelo)**
function dev() {
    watch("src/scss/**/*.scss", css);
    watch("src/JS/**/*.js", javascript);
    watch("html/**/*.html").on("change", browserSync.reload);
    watchTypescript(); // Iniciar la compilación automática de TypeScript
}

// 📌 **Exports para ejecución en package.json**
exports.imagenes = series(convertirFormato, convertirVideos, moverAudios);
exports.dev = series(parallel(css, javascript, watchTypescript), server);
exports.produccion = series(parallel(produccion, minificarHTML), produccion);


// npm install -g typescript gulp-cli; npm install --save-dev gulp gulp-sass sass gulp-plumber autoprefixer cssnano gulp-postcss gulp-sourcemaps gulp-terser gulp-newer fluent-ffmpeg through2 path fs-extra sharp gulp-imagemin gulp-htmlmin gulp-clean-css gulp-webp gulp-avif readline browser-sync child_process typescript rollup @rollup/plugin-typescript
// npm install mysql2
// npm install -g typescript ts-node nodemon
// npm install --save-dev gulp gulp-sass sass gulp-plumber autoprefixer cssnano gulp-postcss gulp-sourcemaps gulp-terser gulp-newer fluent-ffmpeg through2 path fs-extra sharp gulp-imagemin gulp-htmlmin gulp-clean-css gulp-webp gulp-avif readline browser-sync child_process rollup @rollup/plugin-typescript
// npm install -D tailwindcss postcss autoprefixer
// npm install tslib --save-dev


