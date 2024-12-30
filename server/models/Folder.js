const { access } = require("fs");
const mongoose = require("mongoose");
// mongoose.set('strictQuery',true);


var FolderSchema = mongoose.Schema({
  folderName: {
    type: String,
    required: true,
    unique: true
  },
  labeledFolderName: {
    type: String,
  },
  checkedFolderName: {
    type: String,
  },
  finalCheckedFolderName: {
    type: String,
  },
  region: {
    type: String,
    required: true
  },
  // Engineer who assigned the folder
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'engineer',
    required: true
  },
  uploaded_by_role: {
    type: String,
    enum: ['engineer', 'admin'], // Specify the possible roles
    required: true
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manager'
  },
  // Labeler name 
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'labeler'
    // required: true
  },
  totalImageCount: {
    type: Number,
    required: true
  },
  // Manager Name
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manager'
  },
  totalLabeledImageCount: {
    type: Number,
  },
  totalCorrectLabeledImageCountNF: {
    type: Number
  },
  totalCorrectLabeledImageCountF: {
    type: Number
  },
  submissionBasedSalary:{
    type: Number
  },
  checkedBasedSalary: {
    type: Number
  },
  salary: {
    type: Number
  },
  updatedSalary: {
    type: Number
  },
  status: {
    type: String,
    required: true
  },
  imageIndex: {
    type: String
  },
  dataType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'data_type',
    required: true
  },
  subDataType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sub_data_type',
    required: true
  },

  accessControl: {
    annotators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'labeler'
    }],
    managers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'manager'
    }],
    engineers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'engineer'
    }]
  },
  

  // Dates---------------
  createdAt: {
    type: Date,
    default: Date.now,Date
  },
  confirmationDate: {
    type: Date
  },
  assignedDate: {
    type: Date,
  },
  submittedDate: {
    type: Date,
  },
  checkedDate: {
    type: Date,
  },
  finalCheckedDate: {
    type: Date,
  },
  creditedDate: {
    type: Date
  }
})


module.exports = mongoose.model("folder", FolderSchema)