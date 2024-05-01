import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const dbName = 'ecommerce';


export const connectDB = async ()=>{
    
    try{
        await mongoose.connect(`mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=${dbName}`) 
        console.log("Conectado a la base de datos de MongoDB")
    }catch(error){
        console.log("Error conectar a la base de datos de MongoDB", error.message)
    }
}
 
