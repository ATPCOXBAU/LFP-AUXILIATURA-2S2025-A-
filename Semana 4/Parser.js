// Separador: ,
// Delimitadores: "[" "]"
// Separador de notas: ;

/**
 * Analiza líneas con datos de estudiantes en formato CSV
 * Formato esperado: "usuario,carnet,[nota1;nota2;nota3]"
 */
function analizarLineas(texto) {
    // Validación de entrada
    if (!texto || typeof texto !== 'string') {
        return { msg: "Entrada inválida" };
    }
    
    // Separar por comas para obtener las 3 partes principales
    const info = texto.split(",");
    
    if (info.length === 3) {
        // Limpiar espacios en blanco de usuario y carnet
        const usuario = info[0].trim();
        const carnet = info[1].trim();
        const notasTexto = info[2].trim();
        
        // Validar que las notas estén entre corchetes
        if (!notasTexto.startsWith("[") || !notasTexto.endsWith("]")) {
            return { msg: "Formato de notas inválido. Usar [nota1;nota2;nota3]" };
        }
        
        // Extraer notas removiendo delimitadores y separando por ;
        const notasLimpias = notasTexto.replace("[", "").replace("]", "");
        const notasIndividuales = notasLimpias.split(";");
        
        console.log("Notas extraídas:", notasIndividuales);
        
        // Convertir a números y validar
        const notasNumericas = [];
        let notaTotal = 0;
        
        for (let i = 0; i < notasIndividuales.length; i++) {
            const nota = parseFloat(notasIndividuales[i].trim());
            
            // Validar que sea un número válido
            if (isNaN(nota)) {
                return { msg: `Nota inválida: ${notasIndividuales[i]}` };
            }
            
            notasNumericas.push(nota);
            notaTotal += nota;
        }
        
        // Calcular promedio
        const promedio = notaTotal / notasNumericas.length;
        console.log("Promedio calculado:", promedio);
        
        // Retornar objeto con toda la información
        return {
            usuario,
            carnet,
            notas: notasNumericas,
            promedio: Math.round(promedio * 100) / 100, // Redondear a 2 decimales
            totalNotas: notasNumericas.length
        };
        
    } else {
        return { msg: "Formato incorrecto. Esperado: usuario,carnet,[notas]" };
    }
}

/**
 * Procesador de múltiples líneas de estudiantes
 */
class ProcesadorEstudiantes {
    constructor() {
        this.estudiantes = [];
        this.errores = [];
    }
    
    /**
     * Procesa múltiples líneas de texto con datos de estudiantes
     */
    procesarTexto(texto) {
        const lineas = texto.split('\n').filter(linea => linea.trim().length > 0);
        
        for (let i = 0; i < lineas.length; i++) {
            const resultado = analizarLineas(lineas[i]);
            
            if (resultado.msg) {
                // Es un error
                this.errores.push({
                    linea: i + 1,
                    texto: lineas[i],
                    error: resultado.msg
                });
            } else {
                // Es un estudiante válido
                this.estudiantes.push(resultado);
            }
        }
        
        return this.obtenerResumen();
    }
    
    /**
     * Calcula estadísticas del grupo de estudiantes
     */
    obtenerEstadisticas() {
        if (this.estudiantes.length === 0) {
            return { msg: "No hay estudiantes válidos para calcular estadísticas" };
        }
        
        const promedios = this.estudiantes.map(est => est.promedio);
        const promedioGrupo = promedios.reduce((sum, prom) => sum + prom, 0) / promedios.length;
        
        return {
            totalEstudiantes: this.estudiantes.length,
            promedioGrupo: Math.round(promedioGrupo * 100) / 100,
            mejorPromedio: Math.max(...promedios),
            peorPromedio: Math.min(...promedios),
            estudiantesAprobados: this.estudiantes.filter(est => est.promedio >= 7).length
        };
    }
    
    /**
     * Genera resumen completo del procesamiento
     */
    obtenerResumen() {
        return {
            estudiantes: this.estudiantes,
            errores: this.errores,
            estadisticas: this.obtenerEstadisticas()
        };
    }
    
    /**
     * Reinicia el procesador para nuevo análisis
     */
    reiniciar() {
        this.estudiantes = [];
        this.errores = [];
    }
}

// Ejemplos de uso
console.log("ANÁLISIS DE LÍNEA INDIVIDUAL ");
console.log(analizarLineas("Carlos, 20200690 , [10;12;14]"));
console.log(analizarLineas("María, 20200691, [8.5;9.0;7.5]"));
console.log(analizarLineas("Pedro, 20200692, [15;18;20]")); // Error: nota inválida
console.log(analizarLineas("Ana")); // Error: formato incorrecto

console.log("\n PROCESAMIENTO MÚLTIPLE ");
const datosMultiples = `Carlos, 20200690, [10;12;14]
María, 20200691, [8.5;9.0;7.5]
José, 20200692, [6;8;9]
Ana, 20200693, [9.5;8.0;7.0]`;

const procesador = new ProcesadorEstudiantes();
const resumen = procesador.procesarTexto(datosMultiples);

console.log("Resumen completo:", resumen);