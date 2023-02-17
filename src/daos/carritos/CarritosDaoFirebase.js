import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"

class CarritosDaoFirebase extends ContenedorFirebase {

    constructor() { 
        super("carritos")
    }

    async guardar( carrito = { productos: [] , timestamp : Date() }  ) {
        return super.guardar( carrito );
    }
}

export default CarritosDaoFirebase;