import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';


const productsSchema= new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: false // Ahora el campo no es requerido
    },
    code: {
        type: String,
        unique: true, // Se asegura que el código sea único
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true // Establezco true por defecto
    }
})
productsSchema.plugin(paginate);
export const productsModel= mongoose.model("products",productsSchema);