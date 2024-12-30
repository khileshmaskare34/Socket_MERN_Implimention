const engineer = require("../../models/user/engineer")

exports.get_engineers = async(req, res)=>{
    const engineers = await engineer.find({})
    res.status(201).json({engineers})
  }