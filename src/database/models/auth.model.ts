import { Schema, model } from "mongoose";

// Define the IAuth interface
export interface IAuth {
  email: string;
  email_verified: string;
}

// Define the auth schema with unique email
export const authSchema: Schema = new Schema<IAuth>({
  email: { type: String, required: true, unique: true }, // Ensure unique email
  email_verified: { type: String, required: true }
});

// Create a unique index on the email field
authSchema.index({ email: 1 }, { unique: true });

// Create and export the model
const authModel = model<IAuth>("auth", authSchema);
export default authModel;
