const mongoose = require("mongoose");
// mongoose.set('strictQuery',true);

var administrationSchema = mongoose.Schema({
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
  }
});

module.exports = mongoose.model("administration", administrationSchema);
