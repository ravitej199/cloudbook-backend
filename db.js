import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const mongooseURI = process.env.URI


const connect = ()=>{
   let connect = mongoose.connect(mongooseURI);
   connect.then(()=>{
    console.log("connected");
   })
}

export default connect;