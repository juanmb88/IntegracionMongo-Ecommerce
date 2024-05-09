import { Router } from "express";
import CartManager from "../dao/cartManagerMONGO.js";
import ProductManager from "../dao/productManagerMONGO.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

///////////////TRAER TODOS LOS CARRITOS///////////
router.get("/", async (req, res) => {
  try {
    const response = await cartManager.getAllCarts();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send("Error al intentar crear el carrito");
  }
});

////////////////TRAER CARRITO POR ID ///////////////
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    if (!isValidObjectId(cid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Enter valid cid/pid` });
    }

    const carrito = await cartManager.getOneByPopulate({ _id: cid });

    if (!carrito) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Non-existent cart: id ${cid}` });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ carrito });
  } catch (error) {
    res.status(500).send("Error trying to get cart");
  }
});

///////////////////CREAR UN NUEVO CARRITO///////////////////
router.post("/", async (req, res) => {
  try {
    const response = await cartManager.createCart();
    res.json(response);
  } catch (error) {
    res.send("Error when trying to create cart");
  }
});

///////////////////AGREGAR PRODUCTOS AL CARRITO//////////////////
/* router.post("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    //pruebo que vengan id correctos
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid válidos` });
  }

  //traigo carrito
  let carrito = await cartManager.getOneBy({ _id: cid });
  if (!carrito) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
  }

  //traigo producto
  let producto = await productManager.getOneBy({ _id: pid });
  if (!producto) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `No existe producto con id ${pid}` });
  }
  console.log(carrito)
  //busca un producto en un carrito de compras
  let indiceProducto = carrito.products.findIndex(p => p.product == pid);
  if (indiceProducto === -1) {
    carrito.products.push({
      product: pid,
      quantity: 1
    })
  } else {
    carrito.products[indiceProducto].quantity++
  }

  let resultado = await cartManager.update(cid, carrito);
  if (resultado.modifiedCount > 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Carrito actualizado" });
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try later, or contact your administrator`,
      detalle: `The update could not be performed`,
    });
  }
}); */

router.post('/:cid/products/:pid',async(req,res)=>{

  let {cid, pid}=req.params
  if(!isValidObjectId(cid) || !isValidObjectId(pid)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Ingrese cid / pid válidos`})
  }

  let carrito=await cartManager.getOneBy({_id:cid})
  if(!carrito){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Carrito inexistente: id ${cid}`})
  }

  let product=await productManager.getOneBy({_id:pid})
  if(!product){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe producto con id ${pid}`})
  }

  console.log(carrito)
  let indiceProducto=carrito.products.findIndex(p=>p.product==pid)
  if(indiceProducto===-1){
      carrito.products.push({
          product: pid, quantity:1
      })
  }else{
      carrito.products[indiceProducto].quantity++
  }

  let resultado=await cartManager.update(cid, carrito)
  if(resultado.modifiedCount>0){
      res.setHeader('Content-Type','application/json');
      return res.status(200).json({payload:"Carrito actualizado"});
  }else{
      res.setHeader('Content-Type','application/json');
      return res.status(500).json(
          {
              error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
              detalle:`No se pudo realizar la actualizacion`
          }
      )
      
  }

})




















/////////////ELIMINAR PRODUCTO DEL CARRITO POR UNIDAD (QUANTITY)///////////
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  // Verifica si los IDs son válidos
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid válidos` });
  }
  try {
    // Restar 1 a la cantidad del producto en el carrito
    await cartManager.decreaseProductQuantity(cid, pid);

    res.json({
      payload: `Se redujo la cantidad del producto con ID: ${pid} en el carrito con ID: ${cid}`,
    });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

///////////////////////////ELIMINAR CARRITO POR ID//////////////////////////////////
router.delete("/:cid", async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid) {
    return res.status(300).json({ error: "Check unfilled fields" });
  }

  try {
    await cartManager.deleteCartById(cid);
    res.setHeader("Content-Type", "application/json");
    res.json({ payload: `Carrito con ID :${cid} fue eliminado con exito` });
    //console.log("Carrito eliminado");
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

///////////////////////////  ELIMINAR PRODUCTOS AL CARRITO//////////////////////////////////
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  // Verifica si los IDs son válidos
  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Ingrese cid / pid válidos` });
  }
  try {
    await cartManager.deleteProductFromCart(cid, pid);
    res.json({ payload: `Producto con ID :${pid} fue eliminado con exito` });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});