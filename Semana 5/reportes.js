const fs = require('fs');
const path =  require('path');



class GeneradorReportes{
    constructor(){
        this.datos = [];
        this.configuracion = {
            titulo: "Reporte",
            descripcion: "Ejemplo de Reportes",
            tema: "primary",
            directorioSalida: "./reportes"
        };
    }

    
    configurar(opciones) {
        this.configuracion = { ...this.configuracion, ...opciones };
        return this;
    }


    calcularEstadisticas(columna) {
        const valores = this.datos
        .map(fila => parseFloat(fila[columna]))
        .filter(val => !isNaN(val));

        if (valores.length === 0) return null;

        const suma = valores.reduce((acc, val) => acc + val, 0);
        const promedio = suma / valores.length;
        const min = Math.min(...valores);
        const max = Math.max(...valores);
        
        const sorted = [...valores].sort((a, b) => a - b);
        const mediana = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

        const varianza = valores.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0) / valores.length;
        const desviacionEstandar = Math.sqrt(varianza);

        return {
        count: valores.length,
        suma: suma.toFixed(2),
        promedio: promedio.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2),
        mediana: mediana.toFixed(2),
        desviacionEstandar: desviacionEstandar.toFixed(2)
        };
    }

    mostrarEstadisticas(){
        if (this.datos.length === 0){
            console.log("No hay Datos que Analizar")
            return;
        }
        const columnas =  Object.keys(this.datos[0])
        const columnasNumericas = columnas.filter(col => 
            this.datos.some(fila => !isNaN(parseFloat(fila[col])))
        );
        
        columnasNumericas.forEach(col => {
        const stats = this.calcularEstadisticas(col);
        if (stats) {
            console.log(`\n--- ${col} ---`);
            console.log(`  Promedio: ${stats.promedio}`);
            console.log(`  Mediana:  ${stats.mediana}`);
            console.log(`  Minimo:   ${stats.min}`);
            console.log(`  Maximo:   ${stats.max}`);
            console.log(`  Desv.Est: ${stats.desviacionEstandar}`);
        }
        });

        
    }
    cargarDesdeJson(rutaArchivo) {
        try{
            const contenido = fs.readFileSync(rutaArchivo, "utf8");
            this.datos = JSON.parse(contenido);
            console.log("Datos Cargados")
            return this;
        }catch{
            console.log("Error en el Json")
            process.exit(1);
        }
        
    }

    generarTabla(){
        if (this.datos.length === 0){
            return '<div class="alert alert-warning" role="alert">No hay datos para mostrar.</div>';
        }

        const columnas = Object.keys(this.datos[0]);
        let html = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                <thead class="table-${this.configuracion.tema}">
                    <tr>
                    ${columnas.map(col => `<th scope="col">${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        this.datos.forEach((fila, index) => {
            html += '<tr>'
            columnas.forEach(col => {
                const valor = fila[col];
                const esNumerico = !isNaN(parseFloat(valor)) && isFinite(valor);
                html += `<td${esNumerico ? ' class="text-end"' : ''}>${valor}</td>`;

 
            })
            html += '</tr>';
        })
        html += `
            </tbody>
            </table>
            </div>
        `
        

        return html
    }

  generar() {
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.configuracion.titulo}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
      </head>
      <body class="bg-light">
        <div class="container-fluid py-4">
          <!-- Header -->
          <div class="row mb-4">
            <div class="col">
              <div class="card border-0 shadow-sm">
                <div class="card-body text-center py-5">
                  <h1 class="display-4 text-${this.configuracion.tema} mb-3">
                    <i class="bi bi-bar-chart-line me-3"></i>${this.configuracion.titulo}
                  </h1>
                  ${this.configuracion.descripcion ? `<p class="lead text-muted mb-3">${this.configuracion.descripcion}</p>` : ''}
                  <div class="row justify-content-center">
                    <div class="col-auto">
                      <span class="badge bg-${this.configuracion.tema} fs-6 px-3 py-2">
                        <i class="bi bi-calendar3 me-2"></i>${fecha}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Tabla de Datos -->
          <div class="row mb-4">
            <div class="col">
              <div class="card shadow-sm">
                <div class="card-header bg-${this.configuracion.tema} text-white">
                  <h3 class="card-title mb-0">
                    <i class="bi bi-table me-2"></i>Datos Completos
                  </h3>
                </div>
                <div class="card-body p-0">
                  ${this.generarTabla()}
                </div>
              </div>
            </div>
          </div>

          

          <!-- Footer -->
          <div class="row mt-5">
            <div class="col">
              <div class="card border-0">
                <div class="card-body text-center">
                  <small class="text-muted">
                    Reporte generado automaticamente - 
                    ${this.datos.length} registros procesados - 
                    ${fecha}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
      </html>
    `;

  }
  crearDirectorioSalida() {
    if (!fs.existsSync(this.configuracion.directorioSalida)) {
      fs.mkdirSync(this.configuracion.directorioSalida, { recursive: true });
      console.log(` Directorio creado: ${this.configuracion.directorioSalida}`);
    }
  }

  guardarReporte(nombreArchivo){
    try{
        this.crearDirectorioSalida();
        const rutaCompleta = path.join(this.configuracion.directorioSalida, nombreArchivo);
        const html = this.generar();
        fs.writeFileSync(rutaCompleta, html, 'utf8');
        console.log(`REporte Guardado en ${rutaCompleta}`)
        return rutaCompleta;
    }catch(error){
        console.log(error)
        process.exit(1);
    }
  }

}


function generarReporteDesdeArchivo(rutaArchivo, opciones={}){
    const generador = new GeneradorReportes();
    const extension = path.extname(rutaArchivo).toLowerCase();
    if (extension === ".json"){
        generador.cargarDesdeJson(rutaArchivo)
        generador.mostrarEstadisticas();
        const nombreReporte = `reporte_${Date.now()}.html`
        const rutaReporte = generador.guardarReporte(nombreReporte);
        
    }else{
        console.log("No es un Archivo .json");
        process.exit(1);
    }
}

if (require.main === module){

    const args = process.argv.slice(2);
    if (args.length === 0 ){
        console.log("Faltan Parametros <Archivo.json> 'titulo'");
        process.exit(1);
    }
    const rutaArchivo  = args[0];
    const titulo = args[1] || "Reporte"; 
    generarReporteDesdeArchivo(rutaArchivo,{ titulo: titulo })
    
}