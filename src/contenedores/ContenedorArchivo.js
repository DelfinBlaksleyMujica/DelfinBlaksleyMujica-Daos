import { promises as fs } from "fs"
import config from "../config.js"

class ContenedorArchivo {

    constructor( ruta ) {
        this.ruta = `${ config.filesystem.path }/${ ruta }`;
    }

    async listar( id ) {
        try{
            const leer = await fs.readFile( this.ruta , "utf-8" );
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id)
            if (!obj) {
                console.log("No se encontro un item que haga match con el id solicitado");
                return null
            }
            return obj
        }
        catch(e){
            console.log(e)
            return e.message;
        }
        
    }

    async listarAll() {
        try {
            const leer = await fs.readFile( this.ruta , "utf-8" );
            return JSON.parse( leer )
        } catch (error) {
            console.log(error.message);
        }
        
    }

    async guardar( obj ) {
        try {
            const leer = await fs.readFile( this.ruta , "utf-8" );
            const data = JSON.parse( leer );
            let id;
            data.length === 0
            ?
            (id = 1)
            :
            (id = data.length + 1);
            const newElement = {...obj , id , timestamp: Date() };
            data.push(newElement);
            await fs.writeFile( this.ruta , JSON.stringify( data , null , 2 ) , "utf-8");
            console.log("Se agrego el item correctamente");
            return newElement.id;
        }catch (e){
            console.log(e);
            return e.message;
        }
    }

    async addProduct( producto ) {
        try {
            const leer = await fs.readFile( this.ruta , "utf-8" );
            const data = JSON.parse( leer );
            console.log(producto);
            const cantidadDeCarts = data.length;
            console.log(cantidadDeCarts);
            const cartId = cantidadDeCarts;
            console.log(cartId);
            const carrito = data.find( carrito => carrito.id == cartId );
            console.log(carrito);
            carrito.productos.push(producto);
            await fs.writeFile( this.ruta , JSON.stringify( data , null , 2 ) , "utf-8");
            console.log("Se agrego el producto al carrito correctamente");
            return producto
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async deleteProdFromCart( id , idProd ) {
        try {
            const leer = await fs.readFile( this.ruta , "utf-8" );
            const data = JSON.parse( leer )
            let carrito = data.find( carrito => carrito.id == id )
            if (carrito == null) {
                console.log("No existe un carrito con ese id");
                return `No se encontro un carrito con id: ${ id }`;
            } else {
                let prodEnCart = carrito.productos.find( producto => producto.id == idProd )
                if ( prodEnCart == null) {
                    console.log(`No hay producto con dicho id de producto en el carrito con id: ${ id }`);
                    /*return null*/;
                    return `No hay producto con dicho id de producto en el carrito con id: ${ id } `
                } else {
                let productosModificados = carrito.productos.filter( producto => producto.id != idProd );
                console.log(productosModificados);
                carrito = {
                    productos: productosModificados,
                    id: parseInt(id),
                    timestamp: Date()
                } 
                const nuevoArray = data.filter( carrito => carrito.id != id );
                await fs.writeFile( this.ruta , JSON.stringify(nuevoArray , null , 2 ) , "utf-8" )
                nuevoArray.push( carrito )
                await fs.writeFile( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
                console.log("Se borro el producto con id: " + idProd + " del carrito con id: " + id );
                return `Se borro el producto con id: ${ idProd } del carrito con id: ${ id }`
                }
            }
        } catch (error) {
            console.log(error);
            return error.message
        }
    }


    async actualizar( id ,  nuevoElem ) {
        try{
            const leer = await fs.readFile( this.ruta , "utf-8");
            const data = JSON.parse(leer)
            let producto = nuevoElem
            const nuevoArray = data.filter( producto => producto.id != id);
            await fs.writeFile( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            id = parseInt( id );
            nuevoArray.push({...producto , id })
            await fs.writeFile( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            console.log(`Se actualizo el producto con id: ${id}`);
            return id
            
        }catch ( e ) {
            console.log(e);
        }
        
    }

    async borrar( id ) {
        try{
            const leer = await fs.readFile( this.ruta , "utf-8");
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id);
            if( !obj ){
                return null;
            } else{
                const nuevoArray = data.filter( obj => obj.id != id );
                await fs.writeFile( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                return  JSON.stringify(obj)
            }
            
        } catch(e){
            console.log(e);
        }
    }

    async borrarAll() {
        try{
            await fs.writeFile( this.ruta , JSON.stringify([], null , 2) , "utf-8" )
            console.log("Se borraron todos los productos del archivo");
        }catch ( e ){
            console.log( e );
        }
    }
}


export default ContenedorArchivo;