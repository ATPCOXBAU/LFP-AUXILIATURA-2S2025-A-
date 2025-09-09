class Token {
  constructor(tipo, lexema, linea, columna) {
    this.tipo = tipo;
    this.lexema = lexema;
    this.linea = linea;
    this.columna = columna;
  }
}

class Error {
  constructor(tipo, lexema, linea, columna) {
    this.tipo = tipo;
    this.lexema = lexema;
    this.linea = linea;
    this.columna = columna;
  }
}

class AnalizadorLexico {
  constructor() {
    (this.listaTokens = []), (this.listaError = []);
  }

  palabrasReservadas(buffer) {
    const palabras_clave = {
      EQUIPOS: "EQUIPOS",
      equipo: "equipo_prop",
      jugador: "JUGADOR",
      posicion: "POSICION",
      numero: "NUMERO_PROP",
      edad: "EDAD",
    };
    return palabras_clave[buffer];
  }

  esSimbolo(char) {
    return "{}[],:".includes(char);
  }

  esLetra(char) {
    if (!char) return false;
    return /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(char);
  }

  esDigito(char) {
    if (!char) return false;
    return /[0-9]/.test(char);
  }

  esEspacio(char) {
    return /[ \t\n\r]/.test(char);
  }
  analizar(entrada) {
    this.listaTokens = [];
    this.listaError = [];
    let buffer = "";
    const centinela = "#";
    entrada += centinela;
    let linea = 1;
    let columna = 1;
    let estado = 0;
    let index = 0;

    while (index < entrada.length) {
      const char = entrada[index];

      if (estado === 0) {
        if (char === "{") {
          columna += 1;
          this.listaTokens.push(new Token("LLAVE_ABRE", char, linea, columna));
        } else if (char === "}") {
          columna += 1;
          this.listaTokens.push(
            new Token("LLAVE_CIERRA", char, linea, columna)
          );
        } else if (char === "[") {
          columna += 1;
          this.listaTokens.push(
            new Token("CORCHETE_ABRE", char, linea, columna)
          );
        } else if (char === "]") {
          columna += 1;
          this.listaTokens.push(
            new Token("CORCHETE_CIERRA", char, linea, columna)
          );
        } else if (char === ":") {
          columna += 1;
          this.listaTokens.push(new Token("DOSPUNTOS", char, linea, columna));
        } else if (char === ",") {
          columna += 1;
          this.listaTokens.push(new Token("COMA", char, linea, columna));
        } else if (char === '"') {
          columna += 1;
          buffer = '"';
          estado = 1; // reading string
        } else if (this.esLetra(char)) {
          columna += 1;
          buffer = char;
          estado = 2; // reading identifier
        } else if (this.esDigito(char)) {
          columna += 1;
          buffer = char;
          estado = 3; // reading number
        } else if (this.esEspacio(char)) {
          if (char === "\t") columna += 4;
          else if (char === " ") columna += 1;
          else if (char === "\n") {
            linea += 1;
            columna = 1;
          }
        } else if (char === "#") {
          console.log("Análisis del archivo completado exitosamente");
          this.listaTokens.push(new Token("CENTINELA", char, linea, columna));
          break;
        } else {
          columna += 1;
          this.listaError.push(
            new LexError("Error Léxico", char, linea, columna)
          );
        }
      } else if (estado === 1) {
        // inside string
        if (char === '"') {
          columna += 1;
          buffer += '"';
          this.listaTokens.push(new Token("CADENA", buffer, linea, columna));
          buffer = "";
          estado = 0;
        } else if (char === "\n") {
          this.listaError.push(
            new LexError(
              "Error Léxico: Cadena no cerrada",
              buffer,
              linea,
              columna
            )
          );
          buffer = "";
          linea += 1;
          columna = 1;
          estado = 0;
        } else {
          columna += 1;
          buffer += char;
        }
      } else if (estado === 2) {
        if (this.esLetra(char) || this.esDigito(char)) {
          columna += 1;
          buffer += char;
        } else {
          const tipo_token = this.palabrasReservadas(buffer);
          if (tipo_token) {
            this.listaTokens.push(
              new Token(tipo_token, buffer, linea, columna)
            );
          } else {
            this.listaTokens.push(
              new Token("IDENTIFICADOR", buffer, linea, columna)
            );
          }
          buffer = "";
          estado = 0;
          index -= 1;
        }
      } else if (estado === 3) {
        if (this.esDigito(char)) {
          columna += 1;
          buffer += char;
        } else {
          this.listaTokens.push(new Token("ENTERO", buffer, linea, columna));
          buffer = "";
          estado = 0;
          index -= 1;
        }
      }

      index += 1;
    }

    // final buffer
    if (buffer && estado !== 0) {
      if (estado === 1) {
        this.listaError.push(
          new LexError(
            "Error Léxico: Cadena no cerrada",
            buffer,
            linea,
            columna
          )
        );
      } else if (estado === 2) {
        const tipo_token = this.palabrasReservadas(buffer);
        if (tipo_token)
          this.listaTokens.push(new Token(tipo_token, buffer, linea, columna));
        else
          this.listaTokens.push(
            new Token("IDENTIFICADOR", buffer, linea, columna)
          );
      } else if (estado === 3) {
        this.listaTokens.push(new Token("ENTERO", buffer, linea, columna));
      }
    }
  }

  imprimirTokens() {
    console.log("\n=== TOKENS ENCONTRADOS ===");
    this.listaTokens.forEach((token, i) => {
      console.log(
        `${i + 1}. Tipo: ${token.tipo}, Lexema: '${token.lexema}', Línea: ${
          token.linea
        }, Columna: ${token.columna}`
      );
    });
  }

  imprimirErrores() {
    if (this.listaError.length) {
      console.log("\n=== ERRORES ENCONTRADOS ===");
      this.listaError.forEach((err, i) => {
        console.log(
          `${i + 1}. ${err.tipo}: '${err.lexema}', Línea: ${
            err.linea
          }, Columna: ${err.columna}`
        );
      });
    } else {
      console.log("\nNo se encontraron errores léxicos.");
    }
  }

  
}

const scanner = new AnalizadorLexico();

let entrada = ` EQUIPOS {
                equipo: "Leones FC" [
                        jugador: "Carlos Ruiz" [posicion: "PORTERO", numero: 1, edad: 22],
                        jugador: "Luis García" [posicion: "DEFENSA", numero: 4, edad: 21]
                ]
        } #}
`;
let analis = scanner.analizar(entrada);

scanner.imprimirTokens();
scanner.imprimirErrores;
