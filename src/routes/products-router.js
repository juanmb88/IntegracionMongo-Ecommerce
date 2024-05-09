import {Router} from "express"
import ProductManagerMongo from "../dao/productManagerMONGO.js";

const productManager = new ProductManagerMongo();

//esto era con fs pero ahora trabajo con mongo 
// import ProductManager from "../Dao/controllers/fs/productManager.js"
// const manager=new ProductManager(__dirname+'/Dao/database/products.json')
export const router =Router();

/// OBTENER TODOS LOS PRODUC. /////
router.get("/", async (req,res) => {
    const products= await productManager.getProducts();
    res.json({products})
});

/// OBTENER POR ID /////
router.get("/products/:pid", async (req, res) => {
    const productfind = await productManager.getProductById(req.params);
    res.json({ status: "success", productfind });
});

/// DELETE POR ID /////
router.put("/products/:pid", async (req, res) => {
    const updatedproduct = await productManager.updateProduct( req.params, req.body );
     res.json({ status: "success", updatedproduct });
});

/// DELETE POR ID /////
router.delete("/products/:pid", async (req, res) => {
    const id=parseInt(req.params.pid)
    const deleteproduct = await productManager.deleteProductById(id);
     res.json({ status: "success",deleteproduct });
});

/// POST /////
router.post("/", async(req, res)=>{

    let {title, ...otrasPropiedades}=req.body;

    if(!title){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`titulo es requerido`})
    }

    let existe;

    try {
        existe = await productManager.getOneBy({title})
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Unexpected server error - Try later, or contact your administrator`,
                detalle:`${error.message}`
            } )
    }
     if(existe) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ya existe ${title} en BD`});
    } 

    try {
        let newProduct=await productManager.create({title, ...otrasPropiedades});
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({newProduct});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Unexpected server error - Try later, or contact your administrator`,
                detalle:`${error.message}`
            } )
    }
});

