// Ejemplo base para implementar el análisis léxico de torneos

// Estados principales del autómata:
// estado 0: inicio o esperando nuevo token
// estado 1: leyendo cadena ("texto")
// estado 2: leyendo identificador o palabra clave
// estado 3: leyendo número


class Token {
    constructor(tipo, valor, linea, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
}

// Algunas palabras clave de ejemplo:
const palabras_clave = {
    TORNEO: 'TORNEO',
    EQUIPOS: 'EQUIPOS',
    ELIMINACION: 'ELIMINACION',
    FINAL: 'FINAL',
    PARTIDO: 'PARTIDO'
};

// Algunos símbolos reconocidos:
const simbolos = ['{', '}', '[', ']', ':', ','];

// Ejemplo de estructura de análisis (sin funcionalidad):
function analizar(entrada) {
    let estado = 0;
    let buffer = '';
    let index = 0;
    let lista_tokens = []
    // ...aquí iría la lógica para recorrer la entrada y cambiar de estado...
    // Por ejemplo:
    // while (index < entrada.length) {
    //   const char = entrada[index];
    //   if (estado === 0) {
    //     // Reconocer símbolos, palabras clave, cadenas, números...
            //si no se reconoce, registrar error léxico
            // $  
            // if char === "{" 
            //    let tooken = new TOken(Buffer,..... )
            ///    lista_tokens.append(token);
    //   }
    //  else if (estado === 1) {
    //     // Leer cadenas 
    //     else if (estado === 2) {
    //         // Leer identificador o palabra clave 
    //          
    
    //     }
    //   else if (estado === 3) {
    //       // Leer número
    //   }
 
    //   // ...manejar otros estados...
    //   index++;
    // }
}

// Los alumnos deben implementar la funcionalidad completa según sus necesidades