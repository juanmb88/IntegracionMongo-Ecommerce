import {Router} from  'express';
import {  cartManager } from '../app.js';


const cartsRouter =Router();

///////////////////////////TRAER TODOS LOS CARRITOS///////////////////////////////
cartsRouter.get( '/',async (req, res) => {
    try{
        const response = await cartManager.getCarts()
        res.json(response);
    }catch(error){
        console.log(error);
        res.send("Error al intentar crear el carrito");
    }
})

///////////////////////////CREAR UN NUEVO CARRITO//////////////////////////////////

cartsRouter.post( '/',async (req, res) => {
    try{
        const response = await cartManager.newCart()
        res.json(response);
    }catch(error){
        console.log(error);
        res.send("Error al intentar crear el carrito");
    }
})


///////////////////////////OBTENER POR ID CARRITO Y LISTAR PRODUCTOS//////////////////////////////////
cartsRouter.get( '/:cartId', async (req, res) =>{
  const {cartId} = req.params;
        try{
            const response = await cartManager.getCartProducts(cartId);
            res.json(response)
        }catch(error){
            res.send('Error al intentar enviar los productos del carrito' + error.menssage ) 
        }
})

///////////////////////////OBTENER RUTA PARA AGREGAR PRODUCTOS AL CARRITO//////////////////////////////////
cartsRouter.post( '/:cId/products/:pId', async (req, res) => {
    const {cId,pId} = req.params;
        
        try{
            await cartManager.addProductToCart(cId, pId);
            return res.send('Producto agregado exitosamente')
        }catch(error){
            res.send('Producto no fue agregado al carrito' + error.menssage)
        }

})

export {cartsRouter}






