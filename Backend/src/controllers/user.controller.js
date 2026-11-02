import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};

    // Check that all three fields contain text.
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email or username is already taken.
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username is already registered",
      });
    }

    // Validate and save the user. The model hashes the password.
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    // Return only the fields we want the client to receive.
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "User details do not meet the model's requirements",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username is already registered",
      });
    }

    return res.status(500).json({
      message: "Could not register user",
    });
  }
};