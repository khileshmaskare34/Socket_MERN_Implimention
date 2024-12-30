const labeler = require("../../models/user/labeler")

exports.get_labelers = async(req, res)=>{
    const labelers = await labeler.find({})
    .populate('Role', 'dataTypeName')
    res.status(201).json({labelers})
  }