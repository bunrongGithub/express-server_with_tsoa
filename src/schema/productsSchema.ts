import mongoose, { Schema } from "mongoose";

export interface ProductType{
    name: string;
    category: string;
    price: number;
    stock: number;
    qty: number;
}
const ProductSchema:Schema = new Schema<ProductType>({
    name: {type: String, required: true, unique: true},
    category: {type: String,required: true,unique: true},
    price: {type: Number,required: true},
    stock: {type:Number,required:true},
    qty: {type: Number,required: true}
});
const ProductModel = mongoose.model<ProductType>("products",ProductSchema)
export default ProductModel;;