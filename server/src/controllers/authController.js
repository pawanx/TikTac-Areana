import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Already exists",
      });
    }

    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User Created",
      user,
    });
  } catch (error) {
    console.error(`Error while regsiter ${error}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(401).json({
            success: false,
        message: "Invalid credentials.",
        })
    }

    const token = jwt.sign({
        id : user._id
    },process.env.JWT_SECRET, {expiresIn : "7h"});

    res.status(200).json({
        success : true,
        token,
        message : "Login Success",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })

  } catch (error) {
    console.error(`Error While Login: ${error}`)
    res.status(500).json({
        success : false,
        message : error.message
    })
  }
};

