const JSZip = require("jszip");
const Folder = require("../../models/Folder");
const path = require('path')
const fs = require('fs')

exports.upload_folder = async (req, res) => {
    try {
      let { folderName, region, dataType, subDataType, imageIndex, uploadedBy, nameofUploader, status, accessControl } = req.body;
  
      // Parse accessControl form JSON string object.
      accessControl = JSON.parse(accessControl)

      const existingFolder = await Folder.findOne({ folderName: folderName });
      
      if (existingFolder) {
        return res.status(400).json({ message: 'Folder already exists' });
      }
  
      // The path to the uploaded file (temporary name)
      const uploadedFilePath = req.file.path;
  
      // Construct the new filename with the desired folderName
      const fileExtension = path.extname(req.file.originalname); // e.g., '.zip'
      const newFileName = `${folderName}${fileExtension}`;
      const newFilePath = path.join('public/uploads', newFileName);
  
      // Rename the file
      fs.renameSync(uploadedFilePath, newFilePath);
  
      // Now proceed with processing the file at newFilePath
      const zipData = fs.readFileSync(newFilePath); // Read the zip file
  
      // Use JSZip to read the ZIP file
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipData);
  
      // Count the number of image files
      let imageCount = 0;
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && /\.(jpg|jpeg|png|gif)$/i.test(zipEntry.name)) {
          imageCount++;
        }
      });
  
      // Remove the .zip extension from the folder name for database storage
      const folderNameWithoutExtension = newFileName.replace(/\.zip$/i, ''); 

      // Create a new folder document and save to the database
      const newFolder = new Folder({
        folderName: folderNameWithoutExtension, // Already concatenated from frontend
        region: region,
        uploaded_by: uploadedBy,
        uploaded_by_role: nameofUploader,
        totalImageCount: imageCount,
        status: status,
        dataType: dataType,
        subDataType: subDataType,
        imageIndex: imageIndex,
        accessControl:accessControl
      });
  
      await newFolder.save();

      // Emit the new user event via Socket.IO
      const io = req.app.get('io'); // Get the io instance
      if (io) {
        io.emit('newFolder', newFolder); // Emit the new user event
      }

      res.status(200).json({ message: 'Folder uploaded successfully', folder: newFolder });
    } catch (error) {
      console.error('Error assigning folder:', error);
      res.status(500).json({ message: 'Error uploading folder', error });
    }
  }


  exports.update_access_control = async (req, res) => {
    try {
      const { folderId, accessData } = req.body;
  
      const folder = await Folder.findById(folderId);
  
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      // Update the access control data in the folder
      folder.accessControl = {
        annotators: accessData.annotators || [],
        managers: accessData.managers || [],
        engineers: accessData.engineers || [],
      };
  
      // Save the updated folder to the database
      await folder.save();
  
      res.status(200).json({ message: 'Access control updated successfully', folder });

    } catch (error) {
      console.error('Error updating access control:', error);
      res.status(500).json({ error: 'Failed to update access control' });
    }
  };
  