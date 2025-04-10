
import mongoose from "mongoose";

export async function connect () {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection =  mongoose.connection
        connection.on('connected',()=> {
            console.log('mongoDB connected');
            
        })
        connection.on('error', (err)=> {
            console.log('mongoDB connecting error, try again!' + err);
            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong in connecting to database");
        console.log(error);
        
        
    }
    
}