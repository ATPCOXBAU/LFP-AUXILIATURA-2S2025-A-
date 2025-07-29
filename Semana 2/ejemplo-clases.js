class Producto{

    constructor(nombre, precio, cantidadStock){
        this.nombre = nombre;
        this.precio = precio;
        this.cantidadStock = cantidadStock;
    }
    
    mostrarInformacion(){
        return{
            nombre: this.nombre,
            precio: this.precio,
            cantidadStock: this.cantidadStock,
            disponibilidad: this.cantidadStock > 0
        }
    }

    vender(){
        this.cantidadStock -= 1 
    }
}


var producto1 = new Producto("Laptop", 6000, 1)
producto1.vender()
producto1.vender()
console.log(producto1.mostrarInformacion())
