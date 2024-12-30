const manager = require("../../models/user/manager")

exports.get_managers =  async(req, res)=>{
    const managers = await manager.find({})
    .populate('Role', 'dataTypeName')
    res.status(201).json({managers})
  }