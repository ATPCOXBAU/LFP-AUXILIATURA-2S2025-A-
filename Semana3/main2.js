
const fs = require('fs');
const readline = require('readline');

// Interfaz para leer input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ===== CLASE PRINCIPAL =====
class TaskManager {
  constructor() {
    // 1. ARREGLOS - Lista de tareas
    this.tasks = [];
    
    // 2. DICCIONARIOS/MAPS - Para organizar tareas
    this.tasksByCategory = new Map();
    this.completedTasks = new Map();
    
    // Set para categorías únicas
    this.categories = new Set();
    
    // Archivo donde guardar datos
    this.dataFile = 'tasks.json';
  }
  
  // ===== TRABAJAR CON ARREGLOS =====
  
  // Agregar nueva tarea
  addTask(title, category = 'general') {
    const task = {
      id: Date.now(),
      title: title,
      category: category,
      completed: false,
      createdAt: new Date().toLocaleDateString()
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
    
    console.log(` Tarea "${title}" agregada en categoría "${category}"`);
  }
  
  // Buscar tareas usando filter
  searchTasks(searchTerm) {
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  

  // Contar tareas por categoría usando reduce
  countTasksByCategory() {
    return this.tasks.reduce((count, task) => {
      count[task.category] = (count[task.category] || 0) + 1;
      return count;
    }, {});
  }
  
  // ===== TRABAJAR CON MAPS Y DICCIONARIOS =====
  
  // Marcar tarea como completada
  completeTask(taskId) {
    // Buscar tarea en arreglo
    const task = this.tasks.find(t => t.id === taskId);
    
    if (task) {
      task.completed = true;
      task.completedAt = new Date().toLocaleDateString();
      
      // Mover a Map de completadas
      this.completedTasks.set(taskId, task);
      
      console.log(` Tarea "${task.title}" marcada como completada`);
    } else {
      console.log(' Tarea no encontrada');
    }
  }
  
  // Obtener tareas por categoría usando Map
  getTasksByCategory(category) {
    return this.tasksByCategory.get(category) || [];
  }
  
  // ===== ITERACIÓN =====
  
  // Mostrar todas las tareas con for...of
  showAllTasks() {
    console.log('\n=== TODAS LAS TAREAS ===');
    
    if (this.tasks.length === 0) {
      console.log('No hay tareas registradas');
      return;
    }
    
    for (const task of this.tasks) {
      const status = task.completed ? '✅' : '⏳';
      console.log(`${status} [${task.category}] ${task.title} (ID: ${task.id})`);
    }
  }
  
  // Mostrar tareas por categoría usando forEach
  showTasksByCategory() {
    console.log('\n=== TAREAS POR CATEGORÍA ===');
    
    this.tasksByCategory.forEach((tasks, category) => {
      console.log(`\n ${category.toUpperCase()}:`);
      tasks.forEach(task => {
        const status = task.completed ? '✅' : '⏳';
        console.log(`  ${status} ${task.title}`);
      });
    });
  }
  

  // ===== LECTURA DE ARCHIVOS =====
  
  
  // Cargar tareas desde CSV
  loadTasksFromCSV(filename) {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      const lines = data.split('\n');
      //Imprimir archivo leido
      console.log('Contenido del archivo CSV:');
      console.log(data);

    
      
    } catch (error) {
      console.log(' Error leyendo CSV:', error.message);
    }
  }
  
  // ===== ESCRITURA DE ARCHIVOS =====
  
  // Guardar tareas en archivo JSON
  saveTasksToFile() {
    try {
      const dataToSave = {
        tasks: this.tasks,
        savedAt: new Date().toISOString(),
        totalTasks: this.tasks.length
      };
      
      // Convertir a JSON y guardar
      const jsonData = JSON.stringify(dataToSave, null, 2);
      fs.writeFileSync(this.dataFile, jsonData, 'utf8');
      
      console.log(`${this.tasks.length} tareas guardadas en ${this.dataFile}`);
    } catch (error) {
      console.log('Error guardando archivo:', error.message);
    }
  }
  
  // Exportar tareas a CSV
  exportToCSV(filename = 'tareas_export.csv') {
    try {
      let csvContent = 'Titulo,Categoria,Completada\n';
      
      // Agregar cada tarea como línea CSV
      this.tasks.forEach(task => {
        csvContent += `"${task.title}","${task.category}","${task.completed}"\n`;
      });
      
      fs.writeFileSync(filename, csvContent, 'utf8');
      console.log(`Tareas exportadas a ${filename}`);
    } catch (error) {
      console.log('Error exportando CSV:', error.message);
    }
  }
  
}

// ===== MENÚ DE LA APLICACIÓN =====
class TaskApp {
  constructor() {
    this.manager = new TaskManager();
  }
  
  async start() {
    console.log(' === GESTOR DE TAREAS === ');
    

    
    await this.showMenu();
  }
  
  async showMenu() {
    console.log('\n--- MENÚ PRINCIPAL ---');
    console.log('1. Agregar tarea');
    console.log('2. Ver todas las tareas');
    console.log('3. Ver tareas por categoría');
    console.log('4. Buscar tareas');
    console.log('5. Importar desde CSV');
    console.log('6. Exportar a CSV');
    console.log('0. Salir');
    
    const choice = await this.askQuestion('\nElige una opción: ');
    await this.handleChoice(choice);
  }
  
  async handleChoice(choice) {
    switch (choice) {
      case '1':
        await this.addTask();
        break;
      case '2':
        this.manager.showAllTasks();
        break;
      case '3':
        this.manager.showTasksByCategory();
        break;
      case '4':
        await this.searchTasks();
        break;
      case '5':
        await this.importCSV();
        break;
      case '6':
        this.manager.exportToCSV();
        break;
      case '0':
        this.manager.saveTasksToFile();
        rl.close();
        return;
      default:
        console.log(' Opción no válida');
    }
    
    await this.showMenu();
  }
  
  async addTask() {
    const title = await this.askQuestion('Título de la tarea: ');
    const category = await this.askQuestion('Categoría (opcional): ') || 'general';
    this.manager.addTask(title, category);
  }
  
  
  async searchTasks() {
    const searchTerm = await this.askQuestion('Buscar tareas que contengan: ');
    const results = this.manager.searchTasks(searchTerm);
    
    console.log(`\n🔍 Encontradas ${results.length} tareas:`);
    results.forEach(task => {
      const status = task.completed ? '✅' : '⏳';
      console.log(`${status} [${task.category}] ${task.title}`);
    });
  }
  
  async importCSV() {
    const filename = await this.askQuestion('Nombre del archivo CSV: ');
    this.manager.loadTasksFromCSV(filename);
  }
  
  askQuestion(question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }
}

// ===== EJECUTAR LA APLICACIÓN =====
const app = new TaskApp();
app.start().catch(console.error);
