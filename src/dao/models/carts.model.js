import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products:{
    type:[
        {
            product:{
                type: mongoose.Types.ObjectId, ref:"products"
            }, 
            quantity: Number,
        }
    ]
  }
},
  {
    timestamps: true
}
);

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);