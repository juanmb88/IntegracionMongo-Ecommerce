export const middleware01 = (req,res, next)=>{
    
  //  console.log(`'paso por middleware 01', url ${req.url} metodo ${req.method}`);
    
    
    next();
}
export const middleware02 = (req,res, next)=>{
    if(req.query.nombre){
        req.query.nombre =req.query.nombre.toUpperCase() + ' le gusta programar';
    }
    req.codigo="CoderCoder123"
   // console.log(`'paso por middleware 02', url ${req.url} metodo ${req.method}`);
    
    
    next();
}
export const middleware03 = (req,res, next)=>{
    
    console.log(`'paso por middleware 03', url ${req.url} metodo ${req.method}`);
    
    
    next();
}
export const auth = (req,res,next)=>{
    let {usuario, password} =req.query
    if(!usuario || !password){
        res.setHeader('content-text', 'application/json')
        return res.status(400).json({error:"complete usuario y password"})
    }

    if(usuario !== 'admin' || password !== "codercoder"){
        res.setHeader('content-text', 'application/json')
        return res.status(401).json({error:"credenciales invalidas"})
    }

    next()
}
export const errorHandler = (error, req, res, next)=>{
    if(error){
        console.log(error)
        res.setHeader('content-text', 'application/json')
        return res.status(500).json({error:"Error inesperado del servidor - Intente mas tarde",
                                    detalle: `${error.message}`
    })}

    next()
}