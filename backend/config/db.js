import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://calasalde:proCommerce7899@cluster0.ytjuzet.mongodb.net/proCommerce?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`Successfully connected to MongoDB`);
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;