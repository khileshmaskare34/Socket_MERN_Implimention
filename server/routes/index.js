var express = require('express');
const jwt = require('jsonwebtoken')
const db = require('../config/db')
var router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;  // Import ObjectId


const Folder = require('../models/Folder');
const DataType = require('../models/data_types'); 
const SubDataType = require('../models/sub_data_types');

const users = require('../models/users');

const JSZip = require('jszip');
const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')
const multer = require('multer');

const AdmZip = require('adm-zip');

// const { getSocket } = require('../socket')

const engineer = require('../models/user/engineer');
const manager = require('../models/user/manager');
const labeler = require('../models/user/labeler');

const { admin_register } = require('../controllers/Administration/register');
const { admin_login } = require('../controllers/Administration/login');

const { eng_register } = require('../controllers/Engineers/register');
const { eng_login } = require('../controllers/Engineers/login');

const { mang_register } = require('../controllers/Managers/register');
const { mang_login } = require('../controllers/Managers/login');

const { lab_register } = require('../controllers/Labelers/register');
const { lab_login } = require('../controllers/Labelers/login');

const { get_labelers } = require('../controllers/Labelers/getLabelers');
const { get_managers } = require('../controllers/Managers/getManagers');
const { get_engineers } = require('../controllers/Engineers/getEngineers');
const daily_annotator_entries = require('../models/daily_annotator_entries');
const Clock = require('../models/clockInClockOut');
const verifyToken = require('../middlewares/authMiddleware');
const { salary_sheets } = require('../controllers/Sheets/labSalarySheets');
const { sheets } = require('../controllers/Sheets/sheets');
const { get_labeler_sheets } = require('../controllers/Sheets/getLabelerSheets');
const { salary_data } = require('../controllers/Administration/salaryData');
const { labeler_salary } = require('../controllers/Administration/labelerSalary');
const { total_image_data_for_lab } = require('../controllers/Labelers/totalImageDataForLab');
const administration = require('../models/user/administration');
const { daily_entries } = require('../controllers/Sheets/dailyEntrySheets');
const { upload_folder, update_access_control } = require('../controllers/Engineers/uploadFolder');
const multerConf = require('../middlewares/multer_config');
const { download } = require('../controllers/Download/download');
const { labeled_download } = require('../controllers/Download/labeledDownload');
const { checked_download } = require('../controllers/Download/checkedDownload');
const { clock_in, clock_out, break_start, break_end } = require('../controllers/Labelers/Attendance');

const moment = require('moment');

const { submitted_folders_particular_labeler_graph } = require('../controllers/Graphs/submittedFoldersParticularLab_graph');
const { assigned_folders_graph } = require('../controllers/Graphs/assignedFolders_graph');
const { checked_folders_graph } = require('../controllers/Graphs/checkedFolders_graph');
const { final_checked_folders_graph } = require('../controllers/Graphs/finalCheckedFolders_graph');
const { submitted_folders_graph } = require('../controllers/Graphs/submittedFolders_graph');
const { uploaded_folders_graph } = require('../controllers/Graphs/uploadedFolders_graph');
const { labeled_image_graph } = require('../controllers/Graphs/labeledImage_graph');

router.use(express.urlencoded({ extended: true }));
router.use(express.json()); // In case you're expecting JSON data


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// router.use('/temp', express.static(path.join(__dirname, '..', 'public/temp')));

router.get('/xxextract-images/:folderName', async (req, res) => {

  console.log("folderName reqest form frontend_:", req.params)

  const { folderName } = req.params;
  console.log("line89_:", folderName)

  const zipPath = path.join(__dirname, '..', 'public/uploads', `${folderName}.zip`);
  console.log("line92_:", zipPath)

  const extractPath = path.join(__dirname, '..', 'public/temp', folderName);
  console.log("line95_:", extractPath)

  // Extract images if not already extracted
  if (!fs.existsSync(extractPath)) {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);
  }

  // Read extracted images and send filenames to frontend
  fs.readdir(extractPath, (err, files) => {
      if (err) return res.status(500).json({ error: 'Error reading images' });
      const imageUrls = files.map(file => `/temp/${folderName}/${file}`);
      res.json(imageUrls);
  });
});


router.use('/temp', express.static(path.join(__dirname, 'public', 'temp')));

router.get('/extract-images/:folderName', async (req, res) => {
  console.log("folderName reqest form frontend_:", req.params)

  const { folderName } = req.params;
  console.log("folderName:", folderName)

  const zipPath = path.join(__dirname, '..', 'public/uploads', `${folderName}.zip`);
  console.log("zipPath:", zipPath)

  const extractPath = path.join(__dirname, '..', 'public/temp', folderName);
  console.log("extractPath:", extractPath)

  // Extract the zip file if not already done
  if (!fs.existsSync(extractPath)) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
  }

  // Function to find all images in nested directories
  const getAllImageFiles = (dirPath, fileList = []) => {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively search subdirectories
        getAllImageFiles(fullPath, fileList);
      } else if (file.endsWith('.JPG') || file.endsWith('.png') || file.endsWith('.jpeg')) {
        // Add image path relative to the public directory for frontend access
        fileList.push(`/temp/${folderName}/${path.relative(extractPath, fullPath)}`);
      }
    });
    return fileList;
  };

  try {
    // Get all image file URLs
    const imageUrls = getAllImageFiles(extractPath);
    res.json(imageUrls);
  } catch (err) {
    console.error('Error retrieving images:', err);
    res.status(500).json({ error: 'Error retrieving images' });
  }
});

















// Route to fetch labeler details
router.get('/labeler-details', verifyToken, async (req, res) => {
  try {
    const labelerId = req.userId; // Extracted from the token by the middleware
    
    console.log("labx", labelerId)
    // Fetch labeler details from the database using the ID
    const lab_Data = await labeler.findById(labelerId);
    console.log("newlab", lab_Data)
    
    
    if (!lab_Data) {
      return res.status(404).json({ message: 'Labeler not found' });
    }

    res.status(200).json(lab_Data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Administration Register and Login routes
router.post('/administration-register', admin_register)
router.post('/administration-login', admin_login)

// Engineer Register and Login routes
router.post('/engineer-register', eng_register)
router.post('/engineer-login', eng_login);

// Manager Register and Login routes
router.post('/manager-register', mang_register)
router.post('/manager-login', mang_login)

// Manager Register and Login routes
router.post('/labeler-register', lab_register)
router.post('/labeler-login', lab_login)

// fetch all manager from DB
router.get('/get-managers', get_managers)

// fetch all labelers from DB
router.get('/get-labelers', get_labelers)

// fetch all engineers from DB
router.get('/get-engineers', get_engineers)

// get engineer after token verification
router.get('/get-engineer', verifyToken, async (req, res) => {
  try {
    const user = await engineer.findById(req.userId).select('Email Name _id'); // Fetch user
    if (!user) return res.status(404).send('User not found');
    
    res.json(user); // Send user data
    } catch (e) {
      console.error('Server error:', e); // Log server error
      res.status(500).send('Server error');
    }
  });
  
  // get manager after token verification
  router.get('/get-manager', verifyToken, async (req, res) => {
    try {
      const user = await manager.findById(req.userId).select('Email Name _id'); // Fetch user
      if (!user) return res.status(404).send('User not found');
      
      res.json(user); // Send user data
    } catch (e) {
      console.error('Server error:', e); // Log server error
      res.status(500).send('Server error');
    }
  });
  
  // Route to get labeler data
  router.get('/get-labeler', verifyToken, async (req, res) => {
    try {
      const user = await labeler.findById(req.userId).select('Email Name _id'); // Use req.userId from middleware
      if (!user) return res.status(404).send('User not found');
      
      console.log("labeler", user);
      res.json(user); // Send user data
    } catch (e) {
      console.error('Server error:', e);
      res.status(500).send('Server error');
    }
  });
  
  // get engineer after token verification
  router.get('/get-administration', verifyToken, async (req, res) => {
    try {
      const user = await administration.findById(req.userId).select('Email Name _id'); // Fetch user
      if (!user) return res.status(404).send('User not found');
      console.log("admin", user)
      
      res.json(user); // Send user data
    } catch (e) {
      console.error('Server error:', e); // Log server error
      res.status(500).send('Server error');
    }
  });
  
  router.post('/add-data-types', async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "Data type name is required." });
    }
    
    const newDataType = new DataType({ dataTypeName: name });

    await newDataType.save();
    
    res.status(200).json({message: 'Data type Added successfully',newDataType: newDataType});
  } catch (error) {
    console.error("Error adding data type:", error);
    res.status(500).json({ error: "Failed to add data type." });
  }
});

router.post('/sub-data-types', async (req, res) => {
  try {
    const { dataType, subDataTypeName, costPerImage } = req.body;
    
    const newSubDataType = new SubDataType({
      dataType,
      subDataTypeName,
      costPerImage,
    });
    
    await newSubDataType.save();
    res.status(200).send({ message: 'Sub data type added successfully', newSubDataType: newSubDataType });
  } catch (error) {
    console.error("Error adding subData type:", error)
    res.status(500).send({ error: 'Error while adding sub data type' });
  }
});

router.get('/data-types', async (req, res)=>{
  try {
    const dataType = await DataType.find({});
    res.json(dataType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sub data types' });
  }
})

router.get('/sub-data-types/:dataType', async (req, res) => {
  const { dataType } = req.params;
  // console.log("valu", dataType)
  try {
    const subDataTypes = await SubDataType.find({ dataType }).lean();
    res.json(subDataTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sub data types' });
  }
});


// router.post('/assign-folder', upload.single('folder'), upload_folder);
router.post('/assign-folder', multerConf('filename').single('folder'), upload_folder)

router.post('/update-access-control', update_access_control)

router.post('/confirm-folders', async (req, res)=>{
  console.log("confirmation_Data :", req.body);
  const { folderId, action } = req.body;
  
  const updatedFolder = await Folder.findById(folderId)
  
  if (!updatedFolder) {
    return res.status(404).json({ message: "Folder not found" });
  }
  
  if(action === 'accept'){
    updatedFolder.status = "UPLOADED",
    updatedFolder.confirmationDate = Date.now()
    await updatedFolder.save();
      
      res.status(200).json({ message: "Folder accepted and status updated", updatedFolder });
  } else  if(action === 'reject'){
    const deletedFolder = await Folder.findByIdAndDelete(folderId);
    console.log("delted", deletedFolder)
    res.status(200).json({ message: "Folder rejected and deleted" });
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
})

router.get('/download/:filename', download);
router.get('/labeled-download/:filename', labeled_download);
router.get('/checked-download/:filename', checked_download)

// status == PENDING
router.get('/pending-folders-fetch-DB', async(req, res)=>{
  try {
    const folders = await Folder.find({ status: 'PENDING' })
    .populate('dataType', 'dataTypeName') 
    .populate('subDataType', 'subDataTypeName'); 

        //  Manually populate the 'uploaded_by' field based on the role
        const pendingFolders = await Promise.all(
          folders.map(async (folder) => {
            let uploaderName = 'Unknown';
    
            if (folder.uploaded_by_role === 'engineer') {
              const roleEngineer = await engineer.findById(folder.uploaded_by);
              if (roleEngineer) {
                uploaderName = roleEngineer.Name; 
              }
            } else if (folder.uploaded_by_role === 'admin') {
              const admin = await administration.findById(folder.uploaded_by);
              if (admin) {
                uploaderName = admin.Name; 
              }
            }
    
            return {
              ...folder.toObject(),
              uploaded_by_name: uploaderName,
            };
          })
        );

    // Emit the pending folders to all connected clients
    // const io = getSocket();
    // io.emit('pendingFoldersUpdate', pendingFolders);

    res.status(200).json(pendingFolders);
  } catch (error) {
    console.error('Error fetching assigned folders:', error);
    res.status(500).json({ message: 'Error fetching assigned folders', error });
  }  
})

// status == UPLOADED
router.get('/uploaded-folders-fetch-DB', async(req, res)=>{
  try {
    const folders = await Folder.find({ status: 'PENDING' })
    .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
    .populate('subDataType', 'subDataTypeName') // Populate 'name' field from the subDataType model
    .populate('accessControl.annotators', 'Name')
    .populate('accessControl.managers', 'Name')
    .populate('accessControl.engineers', 'Name')

        //  Manually populate the 'uploaded_by' field based on the role
        const assignedFolders = await Promise.all(
          folders.map(async (folder) => {
            let uploaderName = 'Unknown';
    
            if (folder.uploaded_by_role === 'engineer') {
              const roleEngineer = await engineer.findById(folder.uploaded_by);
              if (roleEngineer) {
                uploaderName = roleEngineer.Name; 
              }
            } else if (folder.uploaded_by_role === 'admin') {
              const admin = await administration.findById(folder.uploaded_by);
              if (admin) {
                uploaderName = admin.Name; 
              }
            }
    
            return {
              ...folder.toObject(),
              uploaded_by_name: uploaderName,
            };
          })
        );

    res.status(200).json(assignedFolders);
  } catch (error) {
    console.error('Error fetching assigned folders:', error);
    res.status(500).json({ message: 'Error fetching assigned folders', error });
  }  
})

// fetch the all folder
router.get('/folders-fetch-DB', async(req, res)=>{
  try {
    const folders = await Folder.find()
    .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
    .populate('subDataType', 'subDataTypeName') // Populate 'name' field from the subDataType model
    .populate('accessControl.annotators', 'Name')
    .populate('accessControl.managers', 'Name')
    .populate('accessControl.engineers', 'Name')

        //  Manually populate the 'uploaded_by' field based on the role
        const assignedFolders = await Promise.all(
          folders.map(async (folder) => {
            let uploaderName = 'Unknown';
    
            if (folder.uploaded_by_role === 'engineer') {
              const roleEngineer = await engineer.findById(folder.uploaded_by);
              if (roleEngineer) {
                uploaderName = roleEngineer.Name; 
              }
            } else if (folder.uploaded_by_role === 'admin') {
              const admin = await administration.findById(folder.uploaded_by);
              if (admin) {
                uploaderName = admin.Name; 
              }
            }
    
            return {
              ...folder.toObject(),
              uploaded_by_name: uploaderName,
            };
          })
        );

    res.status(200).json(assignedFolders);
  } catch (error) {
    console.error('Error fetching assigned folders:', error);
    res.status(500).json({ message: 'Error fetching assigned folders', error });
  }  
})

router.post('/assigned-folder-bymanager', async (req, res) => {
  const { managerId, folderId, labelerId, status } = req.body;
  // console.log("managerId", managerId, "labelerId", labelerId, status)

  try {
    const assignedFolder = await Folder.findByIdAndUpdate(
      folderId, // Directly use the folderId
      { $set: { assigned_to: labelerId, status: status, assigned_by: managerId, assignedDate: Date.now() } },
      { new: true } // Return the updated document
    );

    if (!assignedFolder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ message: "Folder Assigned Successfully"});

  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// assiged bu manager but not submitted by lebeler
router.get('/assigned-folder-bymanager', async(req, res)=>{
  const assfol = await Folder.find({status: "NOT SUBMITTED"})
  .populate("uploaded_by", "Name")
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'n                                                                                                                                                                                                                                                                                                                                                     ame' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

  res.status(200).json({ updatedFolder: assfol });
})

// submitted folder by lebeler
router.get('/submitted-folders-bylebeler', async(req, res)=>{
  const { userId } = req.query;
  // console.log("xxid", userId)
  try {
    const submittedFolders = await Folder.find({ 
      assigned_to: userId,
      submittedDate: { $exists: true, $ne: null }
    })
    .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
    .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
    .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
    .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

    // console.log("here is labeled submitted folders",submittedFolders)
    res.status(200).json({ updatedFolder: submittedFolders });
 
  } catch (error) {
    console.log("err", error)
  }
})

// submitted folder by lebeler
router.get('/submitted-folders-byAllLebeler', async(req, res)=>{
  try {
    const submittedFolders = await Folder.find({ 
      status: "SUBMITTED"
    })
    .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
    .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
    .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
    .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

    // console.log("here is labeled submitted folders",submittedFolders)
    res.status(200).json({ updatedFolder: submittedFolders });
 
  } catch (error) {
    console.log("err", error)
  }
})


// Checked folder by manager
router.get('/checked-folders-bymanager', async(req, res)=>{
  const checkedFolders = await Folder.find({
    checkedDate: { $exists: true, $ne: null }
  })
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('checkedBy', 'Name')
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

  // console.log("checkedFolders", checkedFolders)
  res.status(200).json({ checkedFolders: checkedFolders });
})

// fr engineer dashboard
router.get('/checked-folders-bymanager-for-eng', async(req, res)=>{
  const checkedFolders = await Folder.find({
    status: "CHECKED"
  })
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

  // console.log("checkedFolders", checkedFolders)
  res.status(200).json({ checkedFolders: checkedFolders });
})

// Checked folder by manager
router.get('/Final-checked-folders-byengineer', async(req, res)=>{
  const finalCheckedFolders = await Folder.find({
    finalCheckedDate: { $exists: true, $ne: null }
  })
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName'); // Populate 'name' field from the subDataType model

  // console.log("finalCheckedFolders", finalCheckedFolders)
  res.status(200).json({ finalCheckedFolders: finalCheckedFolders });
})


// Daily entries of labelers
router.post('/daily-entries', async(req, res)=>{
  const { folderId, annotator, totalLabeledImageCount } = req.body;

  try {
    const newEntry = new daily_annotator_entries({
      Folder: folderId,
      annotator: annotator,
      totalLabeledImageCount: totalLabeledImageCount
    });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating daily entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
})



router.post("/upload-folder-by-labeler", multerConf('filename').single('file'), async (req, res) => {
  const { folderId, annotatorId } = req.body;

  console.log("fodlerName_0, ", req.body)
  console.log("req.file__", req.file.originalname)
  // Check for required parameters
  if (!folderId || !annotatorId) {
    return res.status(400).json({ error: 'Folder ID and Annotator ID are required.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const oldPath = path.join(__dirname, '..', 'public/uploads', `l_${req.file.originalname}`);
    const newPath = path.join(__dirname, '..', 'public/uploads', `${req.body.folderName}.zip`); 

    // Handle file renaming with proper error handling
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        return res.status(500).json({ error: 'Error renaming file.' });
      }
    });

    const fullPath = path.basename(newPath);

    // Remove the .zip extension from the folder name for database storage
    const folderNameWithoutExtension = fullPath.replace(/\.zip$/i, ''); 

    // Find daily entries for the given annotator and folder
    const dailyEntries = await daily_annotator_entries.find({
      Folder: folderId,
      annotator: annotatorId
    });

    if (!dailyEntries || dailyEntries.length === 0) {
      return res.status(404).json({ error: 'No daily entries found for this annotator and folder.' });
    }

    const totalLabeledImageCount = dailyEntries.reduce((sum, entry) => sum + entry.totalLabeledImageCount, 0);

    const updatedFolder = await Folder.findById(folderId).populate('subDataType', 'costPerImage');

    if (!updatedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const costPerImage = updatedFolder.subDataType?.costPerImage || 0;
    const submittedSalary = totalLabeledImageCount * costPerImage;

    const CheckManagersExist = updatedFolder.accessControl?.managers?.length || 0;
    const CheckEngineersExist = updatedFolder.accessControl?.engineers?.length || 0;

    if (CheckManagersExist <= 0 && CheckEngineersExist <= 0) {
      updatedFolder.status = "FINAL CHECKED";
    } else if (CheckManagersExist <= 0) {
      updatedFolder.status = "CHECKED";
    } else {
      updatedFolder.status = "SUBMITTED";
    }

    updatedFolder.labeledFolderName = folderNameWithoutExtension;
    updatedFolder.totalLabeledImageCount = totalLabeledImageCount;
    updatedFolder.submissionBasedSalary = submittedSalary;
    updatedFolder.submittedDate = Date.now();

    await updatedFolder.save();

    res.status(200).json({ message: 'Folder uploaded and status updated successfully!', updatedFolder });
    
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to upload folder and update folder status.' });
  }
});


// Endpoint to check folder
router.post('/upload-folder-by-manager', multerConf('filename').single('file'), async (req, res) => {
  console.log("checedDAta_:", req.body)
  const { folderId, managerId,  totalCorrectLabeledImageCount } = req.body;

  try {
    console.log(req.file,'asdf')
    
    const oldPath = path.join(__dirname, '..','public/uploads',`l_${req.file.originalname}`);
    console.log(oldPath)
    const newPath = path.join(__dirname, '..','public/uploads', `${req.body.folderName}.zip`);
    
    const fullPath = path.basename(newPath);

    
    console.log("fullPath", fullPath)

    // Remove the .zip extension from the folder name for database storage
    const folderNameWithoutExtension = fullPath.replace(/\.zip$/i, ''); 

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        return res.status(500).send('Error renaming file.');
      }
    })

    const updatedFolder = await Folder.findById(folderId)
      .populate('subDataType', 'costPerImage')

    const costPerImage = updatedFolder.subDataType.costPerImage;
    const checkedSalary = totalCorrectLabeledImageCount * costPerImage;

    console.log("updated_Folder_:", updatedFolder)

    const CheckEngineersExist = updatedFolder.accessControl.engineers.length;
    console.log("CheckEngineersExist:", CheckEngineersExist)

    if(CheckEngineersExist <= 0){
      console.log("final checked chal raha hai")
      updatedFolder.status = "FINAL CHECKED"
      
    } else {

      console.log("checked chal raha hai")
      updatedFolder.status = "CHECKED"
      updatedFolder.checkedBy = managerId
    }
    
    updatedFolder.checkedFolderName = folderNameWithoutExtension,
    updatedFolder.totalCorrectLabeledImageCountNF = totalCorrectLabeledImageCount
    updatedFolder.checkedBasedSalary = checkedSalary;
    updatedFolder.checkedDate = Date.now(); 
    // Save the updated folder
    await updatedFolder.save();

    if(!updatedFolder){
      return res.status(404).json({error: 'Folder not found'})
    }

    // Respond with the updated folder
    res.status(200).json({ message: 'Folder uploaded and status updated successfully!', updatedFolder });

  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to Final check folder
router.post('/Final-checked-folder', async (req, res) => {
  const { folderId, finalCorrectedImageCount } = req.body;

  try {
    // Find the folder by ID
    const folder = await Folder.findById(folderId)
      .populate('subDataType', 'costPerImage')


    const costPerImage = folder.subDataType.costPerImage;
    const salary = finalCorrectedImageCount * costPerImage;  

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Update the folder with the corrected and incorrect image counts
    folder.totalCorrectLabeledImageCountF = finalCorrectedImageCount;
    folder.status = 'FINAL CHECKED'; // Update the status to 'CHECKED'
    folder.finalCheckedDate = Date.now(); 
    folder.salary = salary

    // Save the updated folder
    await folder.save();

    // Respond with the updated folder
    res.status(200).json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API For graphs 

// Graph API for assigned folders to particuler labeler
router.get('/assignedFolders-Graph', assigned_folders_graph);

// For particuler labeler
router.get('/submittedFolders-PL-Graph', submitted_folders_particular_labeler_graph);

router.get('/uploadedFolders-Graph', uploaded_folders_graph);

router.get('/finalCheckedFolders-Graph', final_checked_folders_graph);


router.get('/checkedFolders-Graph', checked_folders_graph);

router.get('/submittedFolders-Graph', submitted_folders_graph);

// labeled image this month or year or any spacific date range
router.get('/labeledImage-Graph', labeled_image_graph);

// Clock in route
router.post('/clock-in', clock_in);

// Clock out route
router.post('/clock-out', clock_out);

// Break start route
router.post('/break-start', break_start);

// Break end route
router.post('/break-end', break_end);

// Route to get lab profile by ID
router.get('/lab-profile', async (req, res) => {
  // console.log("NNNN", req.query)
  const { id } = req.query; // Extract ID from query parameters

  if (!id) {
    return res.status(400).send('User ID is required');
  }

  try {
    // Find the user by ID
    const user = await labeler.findById(id).populate('Role');

    if (!user) {
      return res.status(404).send('User not found');
    } 
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).send('Server error');
  }
});


router.get('/labeler-salary', async(req, res)=>{
  const folders = await Folder.find({
    status: {$in: ['SUBMITTED', 'CHECKED', 'FINAL CHECKED']}
  })
  .populate('uploaded_by', 'Name')
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName') // Populate 'name' field from the subDataType model
  // console.log("costPI", folders)

  res.status(200).json({ finalCheckedFolders: folders });
})

router.get('/labeler-salary-credited', async(req, res)=>{
  const folders = await Folder.find({
    status: "CREDITED"
  })
  .populate('uploaded_by', 'Name')
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName') // Populate 'name' field from the subDataType model

  res.status(200).json({ finalCheckedFolders: folders });
})

router.get('/labeler-salary-pendings', async(req, res)=>{
  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Fetch data from the Folder collection for the previous month
  const previousMonthPending = await Folder.find({
    finalCheckedDate: {
      $lte: startOfCurrentMonth
    },
    status: "FINAL CHECKED"
  })
  .populate('uploaded_by', 'Name')
  .populate("assigned_by", "Name") // Populate 'name' field from the engineer model
  .populate('assigned_to', 'Name') // Populate 'name' field from the labeler` model
  .populate('dataType', 'dataTypeName') // Populate 'name' field from the DataType model
  .populate('subDataType', 'subDataTypeName') 

  console.log("previousPendings", previousMonthPending)
  res.status(200).json({ previousMonthPending: previousMonthPending})
})

router.post('/mark-as-credited', async (req, res) => {
  try {
    const { folderId, salary } = req.body;

    // Find the folder by its ID
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Update the folder with salary and creditedDate
    folder.updatedSalary = salary;
    folder.creditedDate = new Date(); // Assign current date
    folder.status = "CREDITED"

    // Save the updated folder
    await folder.save();

    // Respond with success message and updated folder
    res.status(200).json({
      message: 'Salary and creditedDate added successfully',
      folder: folder
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Failed to update folder' });
  }
});



// fetch total assign, labeled, nonfinal and final image count
router.get('/total-image', async (req, res) => {
  try {
      // Calculate the start and end of the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);
      endOfMonth.setDate(0); // Last day of the month
      endOfMonth.setHours(23, 59, 59, 999);

      // Fetch data from the Folder collection within the current month
      const folders = await Folder.find({
        confirmationDate: { // Assuming 'createdAt' is the field with the date
              $gte: startOfMonth,
              $lte: endOfMonth
          }
      });

       // Fetch data from the Folder collection within the current month
       const foldersChecked = await Folder.find({
        confirmationDate: { // Assuming 'createdAt' is the field with the date
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        status: 'CHECKED'
      });

      // Fetch data from the Folder collection within the current month
      const foldersFinalChecked = await Folder.find({
        confirmationDate: { // Assuming 'createdAt' is the field with the date
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        status: {$in: ['FINAL CHECKED', 'CREDITED']}
      });


      const dailyEntriesLabeledImage = await daily_annotator_entries.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      })


      // Calculate total image count
      const totalImageCount = folders.reduce((acc, folder) => acc + (folder.totalImageCount || 0), 0);
      const totalLabeledImageCount = dailyEntriesLabeledImage.reduce((acc, labeledImage) => acc + (labeledImage.totalLabeledImageCount || 0), 0);

      const totalNonFinalImageCount = foldersChecked.reduce((acc, folder) => acc + (folder.totalCorrectLabeledImageCountNF || 0), 0);
      const totalFinalImageCount = foldersFinalChecked.reduce((acc, folder) => acc + (folder.totalCorrectLabeledImageCountF || 0), 0);

      const data ={
        totalImageCount,
        totalLabeledImageCount,
        totalNonFinalImageCount,
        totalFinalImageCount
      }
      // console.log("totx", data)

      res.json(data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
  }
});

// For Particuler Labeler fetch total assign, labeled, nonfinal and final image count
router.get('/total-image-data-for-labeler', total_image_data_for_lab);

// salary will credite this month
router.get('/salary-data', salary_data)
router.get('/labelers-salary', labeler_salary);


router.get('/data-subData-type', async(req, res)=>{
  const sub_data_type = await SubDataType.find({})
  .populate('dataType', 'dataTypeName')
  res.status(200).json(sub_data_type);
})

// get daily entries data for particular annotator. (createdAt - 26_sept_2024)
router.get('/get-daily-entries-data', async (req, res)=>{
  const {userId} = req.query;

  // using createdAt: -1 for reverse the order of folders.

  const dailyDataFolder = await daily_annotator_entries.find({annotator:userId})
  .populate('Folder', 'folderName')
  .populate('annotator', 'Name')
  .sort({ createdAt: -1 });

  res.status(200).json(dailyDataFolder)
})

// get all the dailyentries data for admin dashboard (createdAt - 30_sept_2024)
router.get('/get-all-daily-entries', async (req, res) => {
  try {
    // Fetch all folders with their necessary populated fields
    const folders = await Folder.find({ status: "NOT SUBMITTED" })
      .populate('uploaded_by', 'Name')
      .populate('assigned_by', 'Name')
      .populate('assigned_to', 'Name')
      .populate('dataType', 'dataTypeName')
      .populate('subDataType', 'subDataTypeName');

    // Get all the folder IDs that were fetched
    const folderIds = folders.map(folder => folder._id);

    // Fetch the daily entries related to those folders
    const dailyEntries = await daily_annotator_entries.find({ Folder: { $in: folderIds } });

    // Initialize a dictionary to sum the totalLabeledImageCount per folder
    const imageCountByFolder = {};

    // Iterate over the daily entries to sum the totalLabeledImageCount for each folder
    dailyEntries.forEach(entry => {
      const folderId = entry.Folder.toString();

      if (imageCountByFolder[folderId]) {
        imageCountByFolder[folderId] += entry.totalLabeledImageCount;
      } else {
        imageCountByFolder[folderId] = entry.totalLabeledImageCount;
      }
    });

    // Combine folder details with their total labeled image counts
    const folderDetailsWithCounts = folders.map(folder => ({
      folder,
      totalLabeledImageCount: imageCountByFolder[folder._id.toString()] || 0 // Default to 0 if no entries for this folder
    }));

    // console.log("folder details with counts:", folderDetailsWithCounts);

    res.status(200).json({ data: folderDetailsWithCounts });
  } catch (err) {
    console.error('Error fetching daily entries or folders:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/get-annotators-attendance', async (req, res) => {
  try {
    const allAnnotators = await labeler.find({});
    
    // Get the start and end of the current day using Moment.js
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    // Query clocked-in users where the clock-in time is within the current day
    const clockedInUsers = await Clock.find({
      clockInTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'Name');

    console.log("allAnnotators_:", allAnnotators);
    console.log("clockedINUsers_:", clockedInUsers);

    // Create two separate arrays: one for clocked-in annotators and one for those absent
    const clockedInAnnotators = [];
    const absentAnnotators = [];

    allAnnotators.forEach(annotator => {
      // Check if the annotator is clocked in today
      const clockRecord = clockedInUsers.find(clock => clock.userId._id.equals(annotator._id));

      console.log("clockRecord :", clockRecord);
      if (clockRecord) {
        clockedInAnnotators.push(clockRecord);
      } else {
        // Annotator is absent, add to the absent array
        absentAnnotators.push({
          ...annotator.toObject(),
          status: 'Absent',
          lastClockInTime: null
        });
      }
    });

    res.status(200).json({
      clockedInAnnotators,
      absentAnnotators
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// sheets--------------------------------------
router.get('/sheets', sheets);
router.get('/get-labeler-sheet', get_labeler_sheets);
router.get('/salary-sheet', salary_sheets);
router.get('/dailyEntry-sheet', daily_entries);


module.exports = router;
