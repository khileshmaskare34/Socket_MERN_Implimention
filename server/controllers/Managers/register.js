const bcrypt = require('bcrypt');
const manager = require('../../models/user/manager');

exports.mang_register = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    // Generate a salt and hash the password
    const saltRounds = 10; // The number of salt rounds, 10 is common and secure
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new manager user with the hashed password
    const newUser = new manager({
      Name: name,
      Email: email,
      Password: hashedPassword, // Store the hashed password
      Role: role
    });

    // Save the new manager to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "Manager Registered Successfully" });
  } catch (error) {
    // Handle errors during registration
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};
