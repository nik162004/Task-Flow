import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            message: "Please fill all required fields."
        });
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message: "Email already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
    });

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
};

const  loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "Please fill all required fields",
        });
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({
            message: "Invalid email or password",
        });
    }

    res.status(200).json({
        message: "login successful",
        token: generateToken(user._id),
        user,
    });
};

export {registerUser, loginUser};