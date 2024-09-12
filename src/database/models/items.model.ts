import Joi from "joi";
import { Schema, model } from "mongoose";
/** Interface to describe a single document */
export interface IItem {
    name: string;
    category: string;
    price: number;
}
/** Schema definition */
export const itemSchema: Schema = new Schema({
    name: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true }
});

export const itemCreateSchema = Joi.object<IItem>({
    name: Joi.string().required().messages({"string.base":
        "name bust be a string",
        "any.required": "name are require",
        "any.only": "Invalid name"
    }),
    category:Joi.string().required().messages({
        "string.base": "category muse be a string",
        "any.required": "category are require",
    }),
    price: Joi.number().required().messages({
        "string.base":"price must be a number",
        "any.required":"price are require"
    }),
})
/** Create a model from the schema */
const ItemModel = model<IItem>('item', itemSchema);
export default ItemModel;