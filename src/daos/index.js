let productosDao
let carritosDao

switch("mongodb") {
    case "mongodb":
        const { default: ProductosDaoMongoDb } = await import("./productos/ProductosDaoMongoDb.js")
        const { default: CarritosDaoMongoDb } = await import("./carritos/CarritosDaoMongoDb.js")

        productosDao = new ProductosDaoMongoDb();
        carritosDao = new CarritosDaoMongoDb();
        break;
    default:
        break;
}

export { productosDao , carritosDao }