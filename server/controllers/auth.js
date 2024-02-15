import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //For authentication
import User from "../models/User.js";

// Register user

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt(); //Use the salt to encrypt this password.
    const passwordHash = await bcrypt.hash(password, salt); //Salting the password entered by use to enhance the security.
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //Status code 201 means that something has been created.
  } catch (err) {
    res.status(500).json({ error: err.message }); //If somthing goes wrong the frontend is going to get the error message with status code of 500.
  }
};

//Loggin in
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //Here we are using mongoose to try to find a user with the specified email.
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; //SO that it does not get sent back to the frontend.
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message }); //We can also customise the error messages. But here we are keeping it simple with just a
  }
};
