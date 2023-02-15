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
                return null
            }
            return obj
        }
        catch(e){
            console.log(e)
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
            console.log("Se agrego el producto " + JSON.stringify(obj.nombre) + " correctamente");
            return newElement.id;
        }catch (e){
            console.log(e);
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
                console.log("No existe un producto con dicho id");
            } else{
                const nuevoArray = data.filter( obj => obj.id != id );
                await fs.writeFile( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                return  console.log("Se elimino el elemento con id: " + id);
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