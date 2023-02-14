import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super( "productos" , {
            nombre:{ type: String , required: true },
            descripcion:{ type:String , required: true },
            codigoDeProducto:{ type: Number , required: true },
            precio: { type: Number , required: true },
            thumbnail: { type: String , required: true },
            stock:{ type: Number , required: true }
        })
    }
}

export default ProductosDaoMongoDb;