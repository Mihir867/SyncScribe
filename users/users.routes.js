import UserController from './users.controllers.js';
import jwtAuthorizer from '../middlewares/jwt.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import passport from 'passport';

const userRouter = express.Router();
const userController = new UserController();

// Get the directory path using import.meta.url
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// Adjust the views path based on the new structure
const viewsPath = path.join(currentDir, '../views');

// Sign-up page
userRouter.get('/signup', (req, res) => {
    res.sendFile(path.join(viewsPath, 'signup.html'));
});

// Sign-in page
userRouter.get('/signin', (req, res) => {
    res.sendFile(path.join(viewsPath, 'signin.html'));
});

// Reset password page
userRouter.get('/reset-password', (req, res) => {
    res.sendFile(path.join(viewsPath, 'reset.html'));
});

// Google OAuth sign-up route
userRouter.get('/signup/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
userRouter.get('/signup/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Sign-up action
userRouter.post('/signup', (req, res) => {
    userController.signUp(req, res);
});

// Sign-in action
userRouter.post('/signin', async (req, res) => {
    try {
        const user = await userController.Login(req, res);
        if (user) {
            const redirectURL = `http://localhost:3000/?username=${user.name}`;
            res.redirect(redirectURL);
        } else {
            // Handle the case where login was not successful
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Reset password action
userRouter.post('/reset-password', jwtAuthorizer, async (req, res, next) => {
    await userController.resetPass(req, res, next);
});

// Logout action
userRouter.post('/logout', jwtAuthorizer, (req, res) => {
    userController.logout(req, res);
});

export default userRouter;
