const administration = require('../../models/user/administration');
const engineer = require('../../models/user/engineer');


exports.admin_register = async(req, res) =>{
    const { name, email, password } = req.body;
    console.log("data", name, email, password);
  
    const newUser = administration({
      Name: name,
      Email: email,
      Password: password
    });
  
    await newUser.save();
    res.status(201).json({message:"User Registered Successfully"})
  }