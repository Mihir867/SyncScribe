import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from './users.repository.js';
import ejs from 'ejs';
import fs from 'fs';
export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
      }

    async resetPass(req, res, next){
        const {newPass} = req.body;
        const hashedpass = await bcrypt.hash(newPass, 4);
        const userID = req.userID;
        try {
            await this.userRepository.resetPassword(userID, hashedpass);

        } catch (error) {
            console.log(error);        }
    }
    async signUp(req, res) {
        try {
            console.log(req.body);
            const { name, email, password } = req.body;
            console.log(password);
            const salt =  await bcrypt.genSalt(10);
            const hashedpass =  await bcrypt.hash(password, salt);

            const user = await this.userRepository.signup({ name, email, password: hashedpass });
            res.status(201).json(user);
            res.redirect('/api/user/signin');

        } catch (error) {
            if (error.message === 'User with this email already exists') {
                res.status(400).json({ error: 'Email is already registered' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async Login(req, res) {
    try {
        const user = await this.userRepository.findbyEmail(req.body.email);

        if (!user || !user.password) {
            return null; // Return null when login is not successful
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordValid) {
            const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
            const token = jwt.sign({ userID: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true });
            return user;
        } else {
            return null; // Return null when login is not successful
        }
    } catch (error) {
        console.error(error);
        return null; // Return null when an error occurs
    }
}

    async logout(req, res) {
        try {
          const userId = req.user._id; // Assuming userId is available in the request
          const result = await this.userRepository.deleteToken(userId, tokenToDelete);
    
          if (result.success) {
            return res.status(200).json({ success: true, message: 'Logout successful' });
          } else {
            return res.status(400).json({ success: false, error: 'Logout failed: ' + result.message });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }
      
      
}