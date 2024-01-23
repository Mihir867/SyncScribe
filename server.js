import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectMongoose } from './middlewares/mongoose.js';
import userRouter from './users/users.routes.js';
import { UserSchema } from './users/users.schema.js';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import Document from "./sdatabase.js"
import jwtAuthorizer from './middlewares/jwt.js';


const UserModel = mongoose.model("User", UserSchema);

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/api/user/', userRouter);


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: '387823521531-6k1638ka30of3poqcp0o8m5uhbttcdu0.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3200/api/user/signup/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {
      user = await UserModel.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

app.get('/api/user/signup/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/user/signup/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), (req, res) => {
  res.redirect('http://localhost:3000/');
});

app.get('/api/user/checkLoggedIn', jwtAuthorizer, async (req, res) => {
  try {
    const userID = req.userID;

    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const loggedInUser = { userID: user._id, name: user.name, email: user.email }; 

    res.json({ user: loggedInUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = 3200;



server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectMongoose();
});
