import mongoose from "mongoose"
import config from "../config.js"

await mongoose.connect( config.mongodb.cnxStr , config.mongodb.options )

class ContenedorMongoDb {

    constructor ( nombreColeccion , esquema ) {
        this.coleccion = mongoose.model( nombreColeccion , esquema )
    }

    async listar( id ) {
        const itemListado = await this.coleccion.find( { _id: id } );
        const itemListadoObj = itemListado[0];
        return itemListadoObj;
    }

    async listarAll() {
        const listado = await this.coleccion.find({})
        return listado;
    }

    async guardar( nuevoElem ){
        const elementoNuevo = new this.coleccion( nuevoElem );
        const savedNewElement = await elementoNuevo.save();
        return savedNewElement;
    }

    async addProduct( producto ) {
        try {
        const carts = await this.coleccion.find({}).sort({_id:-1})
        const cartToUpdate = carts[0];
        console.log(cartToUpdate);
        const updatedCart = await this.coleccion.updateOne( cartToUpdate , { $push: { productos: producto } } )
        return updatedCart;
        } catch (error) {
        console.log(error.message);
        return error.message;
        } 
    }

    async actualizar( id ,  nuevoElem ) {
        const { nombre , descripcion , precio , stock , thumbnail ,codigoDeProducto } = nuevoElem;
        const elementUpdate = await this.coleccion.updateOne( { _id: id } , { $set: { nombre: nombre , descripcion:descripcion , precio: precio , stock:stock , thumbnail:thumbnail , codigoDeProducto: codigoDeProducto } } )
        return elementUpdate;
    }

    async borrar( id ) {
        const userDeleted = await this.coleccion.deleteOne( { _id: id } )
        return userDeleted;
    }

    async borrarAll() {

    }

}


export default ContenedorMongoDb;