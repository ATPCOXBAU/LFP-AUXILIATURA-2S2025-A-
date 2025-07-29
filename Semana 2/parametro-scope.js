// ==========================================
// FUNCIONES CON PARÁMETROS POR DEFECTO
// ==========================================

/**
 * @param {string} nombre - Nombre del usuario (obligatorio)
 * @param {number} edad - Edad del usuario (por defecto: 18)
 * @param {string} rol - Rol del usuario (por defecto: "usuario")
 * @returns {object} Objeto usuario con las propiedades especificadas
 */
function crearUsuario(nombre, edad=18, rol="usuario"){
    return {nombre, edad, rol}
}

/**
 * Función que muestra información del usuario usando destructuring
 * @param {object} usuario - Objeto con propiedades nombre, edad y opcionalmente email
 */
function mostrarUsuario({nombre, edad, email="No Existe"}){
    // Destructuring de parámetros: extrae directamente las propiedades del objeto
    // Si email no existe en el objeto, usa "No Existe" como valor por defecto
    console.log(`${nombre} , ${edad} anios, ${email}`)
}

// Crea un usuario solo con nombre, edad y rol toman valores por defecto
const usuario = crearUsuario("Carlos")

// Ejemplo de uso 
mostrarUsuario(usuario)



// ==========================================
// CLOSURES Y ENCAPSULAMIENTO
// ==========================================

/**
 * Factory function que crea un contador con estado privado
 * Demuestra el concepto de closure en JavaScript
 * @returns {object} Objeto con métodos para manipular el contador
 */
function crearContador(){
    // Variable privada - solo accesible dentro de este scope
    let conteo = 0;
    
    // Retorna un objeto con métodos que tienen acceso a 'conteo'
    // Esto crea un closure: las funciones "recuerdan" el entorno donde fueron creadas
    return {
        // Pre-incremento: incrementa primero, luego retorna
        incremento: () => ++conteo,
        
        // Pre-decremento: decrementa primero, luego retorna
        decremeneto: () => --conteo,
        
        // Getter: retorna el valor actual sin modificarlo
        obtenerValor: () => conteo
    };
}

// Ejemplos de uso del contador 
const contador = crearContador();
console.log(contador.incremento()) 
console.log(contador.obtenerValor()) 

// ==========================================
// SCOPE Y HOISTING: VAR vs LET vs CONST
// ==========================================

/**
 * Función que demuestra las diferencias entre var, let y const
 * Conceptos clave: hoisting, function scope vs block scope
 */
function ejemploScope(){
    console.log("TIPO: VAR");
    
    // HOISTING: var se "eleva" al inicio de la función
    // Aquí varVariable existe pero es undefined (no ReferenceError)
    console.log(varVariable); // undefined
    
    if (true){
        // VAR: Function scope - accesible en toda la función
        // Se declara aquí pero por hoisting ya existía arriba como undefined
        var varVariable = "valor Var";
        
        // LET: Block scope - solo accesible dentro de este bloque {}
        // No tiene hoisting utilizable (Temporal Dead Zone)
        let letVariable = "valor Let";
        console.log(letVariable);
        
        // CONST: Block scope + inmutable (no se puede reasignar)
        // Debe inicializarse en la declaración
        const CONSTVARIABLE = "valor const";
        console.log(CONSTVARIABLE);
    }
    
    // var sigue accesible fuera del bloque if (function scope)
    console.log(varVariable); // "valor Var"
    
    // ERROR: let y const no son accesibles fuera de su bloque
    // Descomentar estas líneas causaría ReferenceError
    // console.log(letVariable);    // ReferenceError
    // console.log(CONSTVARIABLE);  // ReferenceError
}

// Ejecuta para ver las diferencias en la consola
ejemploScope();

