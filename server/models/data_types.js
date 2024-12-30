const mongoose=require("mongoose");
// mongoose.set('strictQuery',true);


var dataTypeSchema=mongoose.Schema({
 dataTypeName:{
    type: String,
    required:true
 }
})


module.exports = mongoose.model("data_type",dataTypeSchema)