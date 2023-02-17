import admin from "firebase-admin";
import config from "../config.js";

admin.initializeApp({
    credential: admin.credential.cert( config.firebase )
})

const db = admin.firestore();

class ContenedorFirebase {

    constructor( nombreColeccion ) {
        this.collection = db.collection( nombreColeccion );
    }

    async listar( id ) {
        try{
            const doc = this.collection.doc(`${ id }`);
            const item = await doc.get();
            const response = item.data()
            console.log( response );
            return response;
        }catch(error){
            console.log(error);
        }
    }

    async listarAll() {
        try{
            const querySnapShot = await this.collection.get();
    
            let docs = querySnapShot.docs;
    
            const response = docs.map( ( doc ) => ({
                id: doc.id,
                nombre: doc.data().nombre,
                precio: doc.data().precio,
                descripcion: doc.data().descripcion,
            }))
            console.log(response);
            return response;
        }catch ( error ) {
            console.log( error );
        }
    }

    async guardar( nuevoElem ) {
        try {
            let doc = this.collection.doc();
            await doc.create( nuevoElem );
            const savedElement = JSON.stringify( nuevoElem )
            return savedElement;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }


    async addProduct( producto ) {
        try {
            const querySnapShot = await this.collection.orderBy("timestamp", "desc").limit(1).get();
    
            let docs = querySnapShot.docs;
    
            const response = docs.map( ( doc ) => ({
                id: doc.id,
                timestamp: doc.data().timestamp,
                productos: doc.data().productos,
            }))
            console.log(response);
            const responseObj = response[0];
            console.log(responseObj.id);

            const id = responseObj.id;
            const doc = this.collection.doc(`${ id }`);

            const unionRes = await doc.update({ productos: admin.firestore.FieldValue.arrayUnion( producto ) } );
            console.log("Se agrego producto al carrito");
            return unionRes
        } catch (error) {
            console.log(error.message);
            return error
        }
    }

    async actualizar( id , nuevoElem ) {
        try {
            const { nombre , precio , descripcion , codigoDeProducto , thumbnail , stock } = nuevoElem;
            const doc = this.collection.doc(`${ id }`);
            const item = await doc.update( { nombre: nombre , precio: precio , descripcion: descripcion , codigoDeProducto:codigoDeProducto , thumbnail: thumbnail , stock: stock } )
            console.log("El producto se actualizo correctamente");
            return item
        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    async borrar( id ) {
        try {
            const doc = this.collection.doc(`${ id }`);
            let item = await doc.delete()
            console.log("Item eliminado de coleccion");
            return item;
        } catch ( error ) {
            console.log( error );
            return error.message;
        }
        
    }

    async borrarAll() {
        try {
            const doc = this.collection.doc();
            let items = await doc.delete();
            console.log("Se eliminaron todos los items");
            return items
        } catch (error) {
            console.log(error.message);
            return error
        }
    }

    async desconectar() {

    }
}


export default ContenedorFirebase;