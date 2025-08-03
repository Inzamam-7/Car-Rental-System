const User =require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const Car = require('../models/Car')
//Generate JWT Token
const generateToken = (userId) =>{
    const payload = {id: userId};
    return jwt.sign(payload,process.env.JWT_SECRET)
}

//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        
        if (!name || !email || !password || password.length < 8) {
            return res.json({
                success: false,
                message: "Fill all the details"
            })
        }

        const userExists = await User.findOne({email})

        if(userExists){
             return res.json({
            success: false,
            message: "User already exists"
        })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = User.create({
            name,
            email,
            password:hashedPassword
        })

        const token = generateToken(user._id)

        res.status(201).json({
            success:true,
            token,
            message:"User Created Suuccessfully"
        })

    } catch (error) {
      console.log(error.message);
      res.json({
        success:false,
        message: "Internal server error"
      })
    }
}


//Login User

const loginUser = async(req,res) =>{
    try{
        const {email,password} = req.body;
       // console.log(req.body);
        
        if(!email || !password){
            return res.json({
                success:false,
                message:"All the details"
            })
        }

        const user = await User.findOne({email});
        if(!user){
             return res.json({
                success:false,
                message:"User does not exists"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const token = generateToken(user._id)
        res.json({
            success:true,
            token,
            message:"User logged-in successfully"
        })

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
        
    }
}

//Get User data using Token (JWT)
const getUserData = async(req,res) =>{
    try{
       const {user} = req;
       res.json({
        success:true,
        user
       })
    }catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message: error.message
        })
    }
}

//Get All Cars for the frontend
const getCars = async(req,res) =>{
    try{
       const cars = await Car.find({isAvailable : true})
       res.json({
        success: true,
        cars
       })
    }catch(error){
       console.log(error.message);
       res.json({
        success: false,
        message: "Internal server error"
       })
    }
}


module.exports = {registerUser, loginUser, getUserData, getCars}