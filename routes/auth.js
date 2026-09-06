import express from 'express';
const authRoutes=express.Router();
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


 //register user
 authRoutes.post('/signup', async (req, res) => {
const {email, password, name}=req.body;
try {
    let user=await User.findOne({email});
    user?res.status(400).send("User already exist"):user=new User({email, password, name});
    await user.save();
    const token=jwt.sign({id:user._id}, "your jwt secret", {expiresIn:"1h"});
    res.status(201).json({token});
} catch (error) {
    res.status(500).json({error:error.message});
} 
})
//login user
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  export default authRoutes;