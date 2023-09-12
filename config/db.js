import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try {
        const conect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB`.bgCyan);
    } catch (error) {
        console.log(`Err in MongoDB ${error}`.bgRed.white);
    }
}


export default connectDB;