import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fetchUserData } from '../Middleware/fetchuser.js';
dotenv.config();
const authrouter = express.Router();


const key = process.env.SECRET_KEY;


// Validation middleware
const validateRegistration = [
  body('username').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Enter valid Email'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
];

authrouter.post('/register', validateRegistration, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password,salt);
    const user = new User({ name :username, email, password });
    await user.save();
    const token = jwt.sign({id: user.id, username: user.name}, key)
    res.status(201).json({ message: 'New user registered successfully', token: token });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).send({ message: 'Email already exists' });
    } else {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
});


//validate login

const validateLogin = [
  body('email').isEmail().withMessage("Enter valid Email"),
  body('password').isLength({min : 5}).withMessage("Password must be atleast 5 characters")
];
authrouter.post('/login',validateLogin, async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty){
    res.status(400).json({errors: errors.array()});
  }
  try{
    let {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Invalid Credentials"});
    }
    const isMatch = await  bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({error: "Invalid Credentials"});

    }

    const token = jwt.sign({ id : user.id, username: user.name },key)
    res.status(200).json({message: "Login Successful", token : token})
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});


  }

  })


  
//get User's data

authrouter.post('/getUserData',fetchUserData,async (req,res)=>{

  try{
    const userdetails = await  User.findById(req.data.id).select("-password");
    console.log(userdetails);
    res.status(200).send(userdetails);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});


  }

})





export default authrouter;
