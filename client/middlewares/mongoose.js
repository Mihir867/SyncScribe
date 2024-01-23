import mongoose from 'mongoose';
export const connectMongoose = async()=>{
    await mongoose.connect('mongodb://localhost:27017/Meet',{
        useNewUrlParser: true,
        useUnifiedTopology:true
    });
    console.log("Mongoose is connected");

}