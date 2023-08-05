import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    //if this not the case above we should to check if the password is correct with the existingapssword
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if(!isPasswordCorrect) return res.status(400).json({ message:"Invalid credentials"})

    //if the user is already exist in database and the password is correct
    const token = jwt.sign({ email: existingUser.email, id:existingUser._id}, 'test', { expiresIn: "1h"})

    // after having the token we will return it
    res.status(200).json({result: existingUser, token})
  } catch (error) {
      //if the token creation didn't went successfully
      res.status(500).json({ message: 'Something went wrong.' })
  }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email })

        //if we have the user
        if(existingUser) return res.status(400).json({ message: "User already exists."})

        if(password !== confirmPassword) return res.status(404).json({ messgae: "Password don't match." })
        
        // hashing the password and set a length of 12
        const hashedPassword = await bcrypt.hash(password, 12);

        // if we don't have the existing user and the password match
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})

        const token = jwt.sign({ email: result.email, id: result._id}, 'test', { expiresIn: "1h"});

        res.status(200).json({result, token})
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. '});
    }

};
