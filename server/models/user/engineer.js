const mongoose = require("mongoose");
// mongoose.set('strictQuery',true);

var engineerSchema = mongoose.Schema({
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

module.exports = mongoose.model("engineer", engineerSchema);
