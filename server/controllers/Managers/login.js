const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const manager = require('../../models/user/manager');

exports.mang_login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login data", email, password);

  if (!email) {
    return res.status(400).json({ message: "Please add email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please add password" });
  }

  try {
    // Find user by email
    const user = await manager.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    // Compare hashed password with provided password
    const isPasswordMatch = await bcrypt.compare(password, user.Password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Generate JWT if password is correct
    const token = jwt.sign({ id: user._id, email: user.Email }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

    console.log("managerLogin", user);
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
