// Usar window.currentFileData para compartir entre scripts
window.currentFileData = null;

// Manejar el envío del formulario
document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fileInput = formData.get("tournamentFile");

    if (fileInput && fileInput.size > 0) {
      uploadFile(fileInput);
    } else {
      alert("Por favor selecciona un archivo");
    }
  });

function uploadFile(file) {
  try {
    const fileReader = new FileReader();

    fileReader.onload = function () {
      window.currentFileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: fileReader.result,
      };

      // Mostrar info del archivo
      document.getElementById("fileName").textContent = file.name;
      document.getElementById("fileSize").textContent = `Tamaño: ${(
        file.size / 1024
      ).toFixed(2)} KB`;
      document.getElementById("fileInfo").style.display = "block";

      // Mostrar contenido en el textarea
      document.getElementById("fileContent").value = fileReader.result;

      // Habilitar botón de análisis
      document.getElementById("analyzeBtn").disabled = false;

      // Limpiar resultados anteriores
      document.getElementById("analysisResults").style.display = "none";

      alert("Archivo cargado con éxito!");
    };

    fileReader.readAsText(file);
  } catch (error) {
    console.error("Error al leer archivo:", error);
    alert("Error al procesar el archivo");
  }
}

function clearContent() {
  document.getElementById("fileContent").value = "";
  document.getElementById("analysisResults").style.display = "none";
  document.getElementById("fileInfo").style.display = "none";
  document.getElementById("analyzeBtn").disabled = true;
  document.getElementById("tournamentFile").value = "";
  window.currentFileData = null;
}

function showSection(sectionName) {
  const sections = ["upload", "report"];
  sections.forEach((section) => {
    document.getElementById(`${section}-section`).style.display = "none";
  });

  // Mostrar la sección seleccionada
  document.getElementById(`${sectionName}-section`).style.display = "block";
}

// Inicializar mostrando la sección de carga
document.addEventListener("DOMContentLoaded", function () {
  showSection("upload");
});

// Exponer funciones global 
if (typeof window !== 'undefined') {
  window.uploadFile = uploadFile;
  window.clearContent = clearContent;
  window.showSection = showSection;
}
