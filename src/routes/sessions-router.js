import { Router } from 'express';
import { UsuariosManagerMongo as UsuariosManager } from '../dao/userManagerMONGO.js';
import { generaHash } from '../utils.js';
import CartManager from '../dao/cartManagerMONGO.js';
export const router=Router()

const usuariosManager = new UsuariosManager();
const cartManager = new CartManager();
router.post('/register', async(req,res)=>{

    let {nombre, email, password}=req.body

    if(!nombre || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete nombre, email, y password`})
    }

    let existe=await usuariosManager.getBy({email})
    if(existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ya existe ${email}`})
    }

    // otras validaciones

    password=generaHash(password)

    try {
        let newCart = await cartManager.createCart()
        let nuevoUsuario=await usuariosManager.create({nombre, email, password, rol:"user",cart:newCart._id})
        res.setHeader('Content-Type','application/json')
        res.status(200).json({
            message:"Registro correcto...!!!", nuevoUsuario
        })
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }

})

router.post("/login", async(req, res)=>{
    let {email, password, web}=req.body

    console.log(req.body)
    if(!email || !password){
         if(web){
            return res.redirect(`/login?error=Complete email, y password`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete email, y password`})
        } 
    }
    // preguntar por adminCoder@coder.com, y la contraseña  si son esos datos, devolves al usuario nombre "admin", email adminCoder@coder.com y rol "admin"
if(email === "adminCoder@coder.com" && password === "adminCod3r123" ){
    let nuevoUsuario=await usuariosManager.create({nombre:"admin", email:"adminCoder@coder.com", password:generaHash(password), rol :"admin"})
    res.setHeader('Content-Type','application/json')
    res.status(200).json({message:"Registro correcto...!!!", nuevoUsuario})
}
       

    let usuario = await usuariosManager.getBy({email, password:generaHash(password)})
    if(!usuario){
        if(web){
            return res.redirect(`/login?error=Credenciales invalidas`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Credenciales inválidas`})
        } 
    }

        usuario={...usuario} 
        delete usuario.password// aca evito que quede guardo el password del user
        req.session.usuario=usuario//aca se guardan los datos del usaurio logueado 


     if(web){
        res.redirect("/")
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario});
    } 

})

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
        res.redirect('/login');
    });
});
