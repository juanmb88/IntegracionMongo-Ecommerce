import {Router} from "express"
import ProductManagerMongo from "../dao/productManagerMONGO.js";

const pm = new ProductManagerMongo();

//esto era con fs pero ahora trabajo con mongo 
// import ProductManager from "../Dao/controllers/fs/productManager.js"
// const manager=new ProductManager(__dirname+'/Dao/database/products.json')
const routerP =Router();

routerP.get("/products",async(req,res)=>{
    const products= await pm.getProducts()
    res.json({products})
})



routerP.get("/products/:pid", async (req, res) => {
    const productfind = await pm.getProductById(req.params);
    res.json({ status: "success", productfind });
  });


  routerP.post("/products", async (req, res) => {
    const newproduct = await pm.addProduct(req.body);
     res.json({ status: "success", newproduct });
  });


  routerP.put("/products/:pid", async (req, res) => {
    const updatedproduct = await pm.updateProduct(req.params,req.body);
     res.json({ status: "success", updatedproduct });
  });


  
  routerP.delete("/products/:pid", async (req, res) => {
    const id=parseInt(req.params.pid)
    const deleteproduct = await pm.deleteProduct(id);
     res.json({ status: "success",deleteproduct });
  });



export default routerP