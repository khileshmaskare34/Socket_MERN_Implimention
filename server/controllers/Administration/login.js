const jwt = require('jsonwebtoken');
const administration = require('../../models/user/administration');

exports.admin_login = async(req, res) =>{
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please add email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please add password" });
    }
  
    try {
      const user = await administration.findOne({ Email: email });
      if (!user || user.Password !== password) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }
      const token = jwt.sign({ id: user._id, email: user.Email }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
  
      res.status(200).json({message: "Login successful", token: token});
    } catch (error) {
      res.status(500).json({ message: "Server error, please try again later" });
    }
  }