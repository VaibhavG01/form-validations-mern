import User from "../models/userData.js";
import bcrypt from "bcryptjs";

export const formData = async (req, res) => {
    const { name, username, email, age, gender, address, password } = req.body;

    // Basic input validation example (can be expanded or replaced with middleware)
    if (!name || !username || !email || !age || !gender || !address || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if email already exists
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }
        // Check if username already exists
        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already in use" });
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const newUser = new User({
            name,
            username,
            email,
            age,
            gender,
            address,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Remove password field from user object before sending response
        const { password: _, ...userSansPassword } = newUser.toObject();

        return res.status(201).json({ message: "User created successfully", user: userSansPassword });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
};
