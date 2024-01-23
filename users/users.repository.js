import mongoose from 'mongoose';
import { UserSchema } from './users.schema.js';

const UserModel = mongoose.model("User", UserSchema);

export default class UserRepository{

    async resetPassword(userID, hashedpassword){
        try {
            let user = await UserModel.findById(userID);
            user.password = hashedpassword;
            user.save();
        } catch (error) {
            console.log(error)
        }
    }
    async signup(user) {
        try {
            const existingUser = await UserModel.findOne({ email: user.email });
    
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
    
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error to propagate it to the calling function
        }
    }
    

    async signin(){
        try {
            return await UserModel.findOne({email, password});
        } catch (error) {
            console.log(error)
        }

    }
    async findbyEmail(email) {
        try{
        return await UserModel.findOne({email});
        } catch(err){
          console.log(err);
        }
      }

    

};
