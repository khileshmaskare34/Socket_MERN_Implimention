const bcrypt = require('bcrypt');
const labeler = require('../../models/user/labeler');

exports.lab_register = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    // Generate a salt and hash the password
    const saltRounds = 10; // Recommended number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new labeler user with the hashed password
    const newUser = new labeler({
      Name: name,
      Email: email,
      Password: hashedPassword, // Store hashed password
      Role: role
    });

    // Save the new labeler to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "Labeler Registered Successfully" });
  } catch (error) {
    // Handle registration errors
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};
