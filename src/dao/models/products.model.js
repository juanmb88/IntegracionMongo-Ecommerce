import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const productCollection="products";

const productSchema= new mongoose.Schema({
    id : {
        type: String,
        default: uuidv4()
    },
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
export const productsModel= mongoose.model(productCollection,productSchema);