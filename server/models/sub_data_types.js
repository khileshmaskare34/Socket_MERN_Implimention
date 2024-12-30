const mongoose = require("mongoose");
// mongoose.set('strictQuery',true);

var subDataTypeSchema = mongoose.Schema({
  dataType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "data_type",
    required: true,
  },
  subDataTypeName: {
    type: String,
    required: true,
  },
  costPerImage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("sub_data_type", subDataTypeSchema);
