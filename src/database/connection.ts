import configs from "../config";
import mongoose from "mongoose";

const connection = async () => {
    console.log(`${configs.mongodbUrl}`);
    try {
        await mongoose.connect(`${configs.mongodbUrl}`);
        console.log(`connection successfully!..`);
    } catch (error) {
        console.log("connection error: ", error);
        throw error;
    }
}
export default connection;