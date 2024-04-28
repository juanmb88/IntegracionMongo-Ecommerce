import mongoose from "mongoose";

export const coneccionDB = async ()=>{
    const dbName = "ecommerce";
    try{
        await mongoose.connect(`mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=${dbName}`) 
        console.log("Conectado a la base de datos")
    }catch(error){
        console.log("Error conectar a la base de datos", error.message)
    }
}

