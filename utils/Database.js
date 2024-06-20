import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({
    path:'../.env'
})

const DatabaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    })
}


export default DatabaseConnection;