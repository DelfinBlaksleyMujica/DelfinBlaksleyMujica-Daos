import express from 'express'
const { Router } = express

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'

//------------------------------------------------------------------------
// instancio servidor

const app = express()

//--------------------------------------------
// permisos de administrador

const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

//--------------------------------------------
// configuro router de productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    try {
        const productos = await productosApi.listarAll()
        console.log("Se muestran todos los productos correctamente");
        res.status(200).send({ productos: productos });
    } catch (error) {
        console.log("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }  
})

productosRouter.get('/:id', async (req, res) => {
    try{
        if (req.params) {
            const { id } = req.params;
            const producto = await productosApi.listar( id )
            return res.status(200).send({ producto : { producto }}) 
        }
    }catch ( error ) {
        console.log("Error en el get de producto por id");
        res.status(500).send({ message : error.message })
    }
})

productosRouter.post('/', soloAdmins, async (req, res) => {
    try {
            const prodBody = req.body;
            const nuevoProd = await productosApi.guardar( prodBody );
            console.log(`Producto nuevo agregado a la base de datos: ${ nuevoProd }`);
            return res.status(200).send( { productoNuevo: nuevoProd } )
    }catch ( error ) {
        console.log("No se pudo agregar el producto a la base de datos");
            res.status(500).send({ message : error.message })
    }  
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const { nombre , descripcion , codigoDeProducto , precio , thumbnail , stock } = req.body;
            const infoUpdatedProduct = {
                nombre: nombre,
                descripcion: descripcion, codigoDeProducto,
                precio: precio,
                thumbnail: thumbnail,
                stock: stock
            }
            const productUpdated = await productosApi.actualizar( id , infoUpdatedProduct )
            console.log("Producto actualizado");
            res.send( { productUpdated: productUpdated } )
        }
    } catch (error) {
        console.log("No se actualizo el producto, error en el PUT del productosRouter");
        res.status(500).send( { message: error.message } )
    }
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const producto = await productosApi.listar( id )
            const deletedProduct = await productosApi.borrar( id )
            console.log(`Se elimino correctamente el producto "${producto.nombre}" de la base de datos`);
            res.status(200).send({ deletedProduct: deletedProduct })
        }
    } catch (error) {
        console.log("No se elimino el producto, error en el DELETE");
        res.status(500).send( { message: error.message } )
    }
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
        try {
            const carritos = await carritosApi.listarAll()
            console.log("Se muestran todos los carritos correctamente");
            res.status(200).send({ carritos: carritos });
        } catch (error) {
            console.log("Error en el get de productos");
            res.status(500).send({ message: error.message });
        }  
})

carritosRouter.post('/', async (req, res) => {
    try {
        const carritoBody = req.body;
        const nuevoCarrito = await carritosApi.guardar( carritoBody );
        console.log(`Carrito nuevo agregado a la base de datos: ${ nuevoCarrito }`);
            return res.status(200).send( { carritoNuevo: nuevoCarrito } )
    } catch (error) {
        console.log("No se pudo agregar el carrito a la base de datos");
        res.status(500).send({ message : error.message })
    }
})

carritosRouter.delete('/:id', async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const carrito = await carritosApi.listar( id )
            const deletedCart = await carritosApi.borrar( id )
            console.log(`Se elimino correctamente el carrito "${carrito.id}" de la base de datos`);
            res.status(200).send({ deletedProduct: deletedCart })
        }
    } catch (error) {
        console.log("No se elimino el carrito, error en el DELETE");
        res.status(500).send( { message: error.message } )
    }
})

//--------------------------------------------------
// router de productos en carrito

carritosRouter.get('/:id/productos', async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const carritoArr = await carritosApi.listar( id );
            const carritoObj = carritoArr[0];
            console.log(carritoObj.productos);
            res.status(200).send( { productos: carritoObj.productos } )
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send( { message: error.message } )
    }
})

carritosRouter.post('/:id/productos', async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const productoArr = await productosApi.listar( id );
            const productoObj = productoArr[0];
            const newProduct = await carritosApi.addProduct( productoObj )
            console.log(newProduct);
            res.send({ producto: `Se agrego el producto ${ productoObj } al carrito` })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send( { error: error.message } )
    }    
        })

carritosRouter.delete('/:id/productos/:idProd', async (req, res) => {
    
})

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app