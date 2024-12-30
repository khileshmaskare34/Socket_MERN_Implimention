const mongoose = require("mongoose");
// mongoose.set('strictQuery',true);

var managerSchema = mongoose.Schema({
  Name: {
    type:String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Role:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'data_type',
    required: true,
  }]
});

module.exports = mongoose.model("manager", managerSchema);
