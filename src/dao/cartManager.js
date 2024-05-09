import fs  from "fs";
import {v4 as uuidv4} from "uuid";

export class CartManager {

        constructor() {
            this.PATH = "./src/data/cart.json";
            this.carts = [];
        }; 

//--------------------FUNCION AGREGAR NUEVO CARRITO ---------------------//
   newCart= async () => { 
        const id = uuidv4()

        let newCart =  { id,  products : []} ;   

        this.carts = await this.getCarts(); //      
        this.carts.push(newCart)

      await fs.promises.writeFile(this.PATH, JSON.stringify(this.carts));

    return newCart;
        
    }

 //-------------------FUNCION OBTENER LISTA DE CARRITOS---------------------//
    getCarts = async  ()=> {
        try {
            const response = await fs.promises.readFile(this.PATH, 'utf-8');
            const responseParse =  JSON.parse(response);  
            return  responseParse ;
        } catch (error) {
            // Si ocurre un error al leer el archivo, se devuelve una lista vacía
            console.error("Error al leer los carritos:", error);
            return [];
        }
        
    };

//-------------------FUNCION OBTENER LISTA DE PRODUCTOS DE CARRITO ---------------------//
    getCartProducts = async(id) =>{
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        
        if (cart){
            return  cart.products
        }else{
            console.log("No se encontró el carrito")
        }

    }
    addProductToCart = async (cId,pId) =>{
        const carts = await this.getCarts();
        const findIndexCart = carts.findIndex(cart => cart.id === cId);

        if(findIndexCart != -1){
          const cartProducts =  await this.getCartProducts(cId)
          const findIndexProductToSave = cartProducts.findIndex(product =>product.id === pId )

                    if(findIndexProductToSave != -1){
                        cartProducts[findIndexProductToSave].quantity++;
                    } else {
                        cartProducts.push({id:pId, quantity:1})
                    }
                    
                    carts[findIndexCart].products = cartProducts//sobreescribo  los productos del carrito de compras con la nueva lista de productos
                    await fs.promises.writeFile(this.PATH, JSON.stringify(carts));// se guarda en el archivo la lista de  carritos actualizada
                    console.log("producto agregado con exito") //  para ver si funciona
                } else {
                        throw new Error("Carrito no encontrado, producto no agregado");
                    }
    }
    
    decreaseProductQuantity = async (cid, pid)=>{
      try {
          const cart = await cartsModel.findById(cid);
          const productIndex = cart.products.findIndex(product => product.product == pid);
  
          if (productIndex !== -1) {
              // Si el producto existe en el carrito, disminuir su cantidad
              if (cart.products[productIndex].quantity > 1) {
                  cart.products[productIndex].quantity -= 1;
                  await cart.save();
              } else {
                  // Si la cantidad es 1, eliminar el producto del carrito
                  cart.products.splice(productIndex, 1);
                  await cart.save();
              }
          }
  
          return true;
      } catch (error) {
          console.log(error);
          return false;
      }
  }
}

