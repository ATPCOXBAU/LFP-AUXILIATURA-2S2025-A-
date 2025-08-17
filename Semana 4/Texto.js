// TOKEN: Unidad mínima de información
// PATRÓN: Secuencia de caracteres que se repiten o cumplen reglas
// DELIMITADORES: Separadores de tokens

/**
 * Valida estructura básica de emails
 */
function identificarEmail(email) {
    if (!email || typeof email !== 'string') {
        return { msg: "Entrada inválida" };
    }
    
    const partes = email.split("@");
    
    // Solo debe haber un @ y partes no vacías
    if (partes.length !== 2 || partes.some(parte => parte.length === 0)) {
        return { msg: "El correo es inválido" };
    }
    
    const [user, domain] = partes;
    
    // Validar formato básico del dominio
    if (!domain.includes(".")) {
        return { msg: "Dominio inválido" };
    }
    
    const subdominios = domain.split(".");
    const subdominiosValidos = subdominios.filter(sub => sub.length > 0);
    
    return {
        user,
        domain,
        subdominios: subdominiosValidos,
        esEdu: domain.endsWith(".edu"),
        esComercial: domain.endsWith(".com"),
        esValido: true
    };
}

/**
 * Buscador avanzado de texto con múltiples opciones
 */
class BuscadorTexto {
    constructor(texto) {
        if (typeof texto !== 'string') {
            throw new Error('El texto debe ser una cadena');
        }
        this.texto = texto.toLowerCase();
        this.textoOriginal = texto;
        this.estadisticas = this.calcularEstadisticas();
    }
    
    calcularEstadisticas() {
        return {
            longitud: this.textoOriginal.length,
            palabras: this.textoOriginal.split(/\s+/).length,
            lineas: this.textoOriginal.split('\n').length
        };
    }
    
    /**
     * Búsqueda simple con opciones configurables
     */
    busquedaSimple(patron, opciones = {}) {
        const { 
            caseSensitive = false, 
            palabraCompleta = false,
            contextoTamaño = 20 
        } = opciones;
        
        const textoParaBuscar = caseSensitive ? this.textoOriginal : this.texto;
        const patronParaBuscar = caseSensitive ? patron : patron.toLowerCase();
        
        const indices = [];
        let index = 0;
        
        // Buscar todas las ocurrencias
        while ((index = textoParaBuscar.indexOf(patronParaBuscar, index)) !== -1) {
            // Verificar si es palabra completa cuando se requiere
            if (palabraCompleta && !this.esPalabraCompleta(index, patronParaBuscar.length)) {
                index++;
                continue;
            }
            
            indices.push({
                index,
                contexto: this.obtenerContexto(index, patronParaBuscar.length, contextoTamaño),
                linea: this.obtenerNumeroLinea(index)
            });
            
            index++;
        }
        
        return {
            patron: patron,
            coincidencias: indices.length,
            resultados: indices
        };
    }
    

    /**
     * Verifica límites de palabra para búsqueda de palabras completas
     */
    esPalabraCompleta(indice, longitud) {
        const antes = indice === 0 || !/\w/.test(this.textoOriginal[indice - 1]);
        const despues = (indice + longitud >= this.textoOriginal.length) || 
                       !/\w/.test(this.textoOriginal[indice + longitud]);
        return antes && despues;
    }
    
    /**
     * Extrae contexto alrededor de coincidencias con resaltado visual
     */
    obtenerContexto(indice, longitud, tamaño = 20) {
        const inicio = Math.max(0, indice - tamaño);
        const fin = Math.min(this.textoOriginal.length, indice + longitud + tamaño);
        
        const contexto = this.textoOriginal.substring(inicio, fin);
        const marcador = '█'.repeat(longitud);
        const posicionRelativa = indice - inicio;
        
        return {
            texto: contexto,
            resaltado: contexto.substring(0, posicionRelativa) + 
                      marcador + 
                      contexto.substring(posicionRelativa + longitud)
        };
    }
    
    obtenerNumeroLinea(indice) {
        return this.textoOriginal.substring(0, indice).split('\n').length;
    }
    
    /**
     * Divide texto en tokens según delimitadores
     */
    tokenizar(delimitadores = /\s+/) {
        return this.textoOriginal
            .split(delimitadores)
            .filter(token => token.length > 0)
            .map((token, index) => ({
                token,
                indice: index,
                longitud: token.length
            }));
    }
    
    obtenerEstadisticas() {
        return { ...this.estadisticas };
    }
}

// Ejemplos de uso
console.log(" PRUEBAS DE EMAIL ");
console.log(identificarEmail("pr@ueba@gmail.com.edu"));
console.log(identificarEmail("usuario@dominio.com"));
console.log(identificarEmail("test@universidad.edu.com.gt"));

console.log("\n BÚSQUEDA DE TEXTO ");
const texto = `JavaScript es un lenguaje de programación versátil y potente para el desarrollo web.
JavaScript permite crear aplicaciones interactivas y dinámicas.
Con JavaScript puedes desarrollar tanto frontend como backend.`;

const buscador = new BuscadorTexto(texto);

console.log("Búsqueda simple:", buscador.busquedaSimple("javascript"));

console.log("\nTokenización:", buscador.tokenizar());
console.log("\nEstadísticas:", buscador.obtenerEstadisticas());