import mongoose from 'mongoose'
import { Schema } from 'mongoose';
const productSchema = new Schema({
    productName: { type: String },
    productPrice: { type: Number },
    productDescription: { type: String },
    productImage: { type: String },
    productQuantity: { type: Number },
    createdOn: { type: Date }
})

const Product = mongoose.model("Product", productSchema);

export { Product };