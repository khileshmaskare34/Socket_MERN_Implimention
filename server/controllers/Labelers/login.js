const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const labeler = require('../../models/user/labeler');

exports.lab_login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login data", email, password);

  if (!email) {
    return res.status(400).json({ message: "Please add email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please add password" });
  }

  try {
    const user = await labeler.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    // Generate a token (if needed)
    const token = jwt.sign({ id: user._id, email: user.Email }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

    res.status(200).json({ message: "Login successful", token: token}); 
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
