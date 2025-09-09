import { AnalizadorLexicoTorneos } from "./parser.js";
import { generarTablaTokens, generarTablaErrores,generarEstructuras} from "./reportes.js";


var parser;
// Asegurarse en este contexto
if (typeof window !== 'undefined') {
  window.currentFileData = null;
}

function analyzeTournament() {
  if (!window.currentFileData) {
    alert("No hay archivo cargado");
    return;
  }

  try {
    const content = window.currentFileData.content;
    const fileName = window.currentFileData.name;
    const fileExtension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();

    let analysis = {};


    analysis = analyzeText(content);

    // Mostrar resultados
    displayAnalysis(analysis);
  } catch (error) {
    console.error("Error en análisis:", error);
    alert("Error al analizar el archivo: " + error.message);
  }
}



function analyzeText(content) {
    parser = new AnalizadorLexicoTorneos();
    parser.analizar(content);
    parser.imprimirErrores();
    parser.imprimirTokens();

  return {
    type: "Archivo de Texto",
    tokens: parser.listaTokens,
    errores: parser.listaError,
  };
}

function displayAnalysis(analysis) {
  // Crear información del análisis
  document.getElementById("analysisContent").value = "Analisis Lexico Completo";
  document.getElementById("analysisResults").style.display = "block";
}

// Generar reporte según selección del usuario
function generarReporteSeleccionado() {
  const tipo = document.getElementById('reportType').value;
  let resultado = '';
  switch(tipo) {
    case 'reporte1':
      resultado = '<h5>Reporte 1: Tabla de Tokens</h5>';
      generarTablaTokens(parser.listaTokens);
      generarEstructuras(parser.listaTokens);
      break;
    case 'reporte2':
      resultado = '<h5>Reporte 2: Tabla de Errores</h5>';
      generarTablaErrores(parser.listaError);
      break;
    case 'reporte3':
      resultado = '<h5>Reporte 3: Estadísticas de Jugadores</h5><p>Estadísticas individuales de los jugadores.</p>';
      break;
    case 'reporte4':
      resultado = '<h5>Reporte 4: Partidos Destacados</h5><p>Lista de partidos destacados del torneo.</p>';
      break;
    case 'reporte5':
      resultado = '<h5>Reporte 5: Ranking Final</h5><p>Ranking final de los participantes.</p>';
      break;
    default:
      resultado = '<p>Selecciona un reporte válido.</p>';
  }
  document.getElementById('reporteResultado').innerHTML = resultado;
}

// Exponer funciones al ámbito global 
if (typeof window !== 'undefined') {
  window.analyzeTournament = analyzeTournament;
  window.generarReporteSeleccionado = generarReporteSeleccionado;
}


