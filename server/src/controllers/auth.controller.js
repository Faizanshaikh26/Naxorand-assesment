import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    // Check for duplicate email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check for duplicate username
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Registration Successful", data: user });
  } catch (error) {
    console.error("Error while registering user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter a valid email" });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter a valid password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Send response with user data and token
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token,
    });
  } catch (error) {
    console.log("Error while logging in", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

