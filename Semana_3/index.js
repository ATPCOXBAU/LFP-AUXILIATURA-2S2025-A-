const { Console } = require("console");
const fs = require("fs");
const { stdin } = require("process");
const readLine = require("readline");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class TaskManager {
  constructor() {
    // 1. ARREGLOS - Lista de tareas
    this.tasks = [];

    // 2. DICCIONARIOS/MAPS - Para organizar tareas
    this.tasksByCategory = new Map();

    // Set para categorías únicas
    this.categories = new Set();

    // Archivo donde guardar datos
    this.dataFile = "tasks.json";
  }

  addTask(title, category = "general") {
    const task = {
      id: Date.now(),
      title: title,
      category: category,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    };

    // Agregar al arreglo principal
    this.tasks.push(task);

    // Agregar categoría al Set (evita duplicados automáticamente)
    this.categories.add(category);

    // Organizar en Map por categoría
    if (!this.tasksByCategory.has(category)) {
      this.tasksByCategory.set(category, []);
    }
    this.tasksByCategory.get(category).push(task);

    ///  tasksByCategory { "General": [Objetos de Categoria a las Que Pertenecen], "Historia" : [Etcc....]}

    console.log(` Tarea "${title}" agregada en categoría "${category}"`);
  }

  showAllTasks() {
    console.log("\n TODAS LAS TAREAS");

    if (this.tasks.length === 0) {
      console.log("No hay tareas registradas");
      return;
    }

    for (const task of this.tasks) {
      const status = task.completed ? "✅" : "⏳";
      console.log(
        `${status} [${task.category}] ${task.title} (ID: ${task.id})`
      );
    }
  }

  // Mostrar tareas por categoría usando forEach
  showTasksByCategory() {
    console.log("\n=== TAREAS POR CATEGORÍA ===");

    this.tasksByCategory.forEach((tasks, category) => {
      console.log(`\n ${category.toUpperCase()}:`);
      tasks.forEach((task) => {
        const status = task.completed ? "✅" : "⏳";
        console.log(`  ${status} ${task.title}`);
      });
    });
  }
 
  // ===== ESCRITURA DE ARCHIVOS =====
  
  // Cargar tareas desde CSV
  loadTasksFromCSV(filename) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      const lines = data.split("\n");
      //Imprimir archivo leido
      console.log("Contenido del archivo CSV:");
      console.log(data);
      
    } catch (error) {
      console.log(" Error leyendo CSV:", error.message);
    }
  }


  // Guardar tareas en archivo JSON
  saveTasksToFile() {
    try {
      const dataToSave = {
        tasks: this.tasks,
        savedAt: new Date().toISOString(),
        totalTasks: this.tasks.length,
      };

      // Convertir a JSON y guardar
      const jsonData = JSON.stringify(dataToSave, null, 2);
      fs.writeFileSync(this.dataFile, jsonData, "utf8");

      console.log(`${this.tasks.length} tareas guardadas en ${this.dataFile}`);
    } catch (error) {
      console.log("Error guardando archivo:", error.message);
    }
  }

  // Buscar tareas usando filter
  searchTasks(searchTerm) {
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  
}

class App {
  constructor() {
    this.manager = new TaskManager();
  }

  async start() {
    console.log("Se inicio el Programa: ");
    await this.menu();
  }

  async menu() {
    console.log("\n--- MENÚ PRINCIPAL ---");
    console.log("1. Agregar tarea");
    console.log("2. Ver todas las tareas");
    console.log("3. Ver tareas por categoría");
    console.log("4. Buscar tareas");
    console.log("5. Importar desde CSV");
    console.log("6. Exportar a CSV");
    console.log("0. Salir");
    const opcion = await this.preguntarInfo("Elige una opcion:");
    await this.manejarOpcion(opcion);
  }

  async manejarOpcion(opcion) {
    switch (opcion) {
      case "1":
        await this.addTask();
        break;
      case "2":
        this.manager.showAllTasks();
        break;
      case "3":
        this.manager.showTasksByCategory();
        break;
      case "4":
        await this.searchTasks();
        break;
      case "5":
        await this.importCSV();
        break;
      case "6":
        this.manager.saveTasksToFile();
        break;
      case "0":
        //Terminar el programa
        console.log("Saliendo del programa...");
        rl.close();
        return;

      default:
        console.log(" Opción no válida");
    }

    await this.menu();
  }

  async addTask() {
    const titulo = await this.preguntarInfo("Nombre de La tarea: ");
    const categoria = await this.preguntarInfo("Nombre Categoria: ");
    this.manager.addTask(titulo, categoria);
  }
  
  async importCSV() {
    const filename = await this.preguntarInfo('Nombre del archivo CSV: ');
    this.manager.loadTasksFromCSV(filename);
  }
    
  async searchTasks() {
    const searchTerm = await this.preguntarInfo('Buscar tareas que contengan: ');
    const results = this.manager.searchTasks(searchTerm);
    
    console.log(`\n🔍 Encontradas ${results.length} tareas:`);
    results.forEach(task => {
      const status = task.completed ? '✅' : '⏳';
      console.log(`${status} [${task.category}] ${task.title}`);
    });
  }
  
  preguntarInfo(pregunta) {
    return new Promise((resultado) => {
      rl.question(pregunta, resultado);
    });
  }
}

const app = new App();
app.start().catch(console.error);
