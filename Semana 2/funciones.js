// ==========================================
// LAS 3 FORMAS DE ESCRIBIR FUNCIONES EN JS
// ==========================================

//  FUNCIÓN CLÁSICA (Function Declaration)
function decirSaludo(nombre){
    return `Hola: ${nombre}`
}

//  FUNCIÓN COMO VARIABLE (Function Expression)  
// Básicamente guardamos una función en una variable
const saludo = function(name){
    return `Hola ${name}`
}

//  FUNCIÓN FLECHA SIMPLE (Arrow Function - una línea)
const saludoArrow = (nombreSaludo) => `Hola desde la Arrow, ${nombreSaludo}`
//  No necesita 'return' ni llaves {} cuando es una sola expresión

// 4️ FUNCIÓN FLECHA CON BLOQUE (Arrow Function - múltiples líneas)
// Cuando necesitas hacer más cosas, usas llaves {} y sí necesitas 'return' si quieres devolver algo
const saludoArrowBloque = (nombreBloque) => {
    console.log("Hola: ")
    
    for (let index = 0; index < 3; index++) {
        console.log(nombreBloque) 
    }
}

// ==========================================
// PROBANDO TODAS LAS FUNCIONES
// ==========================================

// Función clásica - devuelve el string
console.log(decirSaludo("Carlos"))

// Función flecha simple - también devuelve el string  
console.log(saludoArrow("Javier"))

// Función flecha con bloque - no devuelve nada, solo imprime
saludoArrowBloque("Maria")

// ==========================================
// ¿CUÁNDO USAR CADA UNA?
// ==========================================

/*
     FUNCIÓN CLÁSICA (function nombre()):
  - Cuando quieres que sea accesible desde cualquier parte (hoisting)
  - Para funciones principales o importantes
  - Más fácil de debuggear porque tiene nombre
    
  FUNCIÓN EN VARIABLE (const nombre = function()):
  - Cuando quieres más control sobre cuándo se define
  - No tiene hoisting, solo funciona después de declararla

    ARROW FUNCTION SIMPLE (const nombre = () => algo):
  - Para funciones cortas de una línea
  - Callbacks, filters, maps, etc.
  - Más limpia y moderna

     ARROW FUNCTION CON BLOQUE (const nombre = () => { ... }):
  - Cuando necesitas varias líneas pero quieres sintaxis moderna
*/
