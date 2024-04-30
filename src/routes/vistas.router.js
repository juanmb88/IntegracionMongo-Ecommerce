import { Router } from 'express';
import  ProductManagerMONGO  from '../dao/productManagerMONGO.js';
//import __dirname from '../utils.js';

export const router = Router()
//const productManager = new ProductManager(__dirname+'/data/products.json')

const pm = new ProductManagerMONGO()
router.get('/', async (req,res)=>{
    const listOfProducts = await pm.getProducts(); 
//    res.setHeader('Content-Type','text/html');
    res.status(200).render('inicio', {listOfProducts});
//    console.log(listOfProducts)
})
//aca usamos socket
 router.get('/realTimeproducts', async (req,res) => {
    res.status(200).render('realTimeProducts')
    
}) 
router.get('/chat', async (req,res) => {
    res.status(200).render('chat')

})

export default router;