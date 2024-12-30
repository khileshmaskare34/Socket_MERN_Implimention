const JSZip = require('jszip');
const path = require('path')
const fs = require('fs');
const Folder = require('../../models/Folder');

exports.checked_download = async (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../../public/uploads', `${fileName}.zip`);
  
    console.log("Requested file:", fileName);
    // console.log("Resolved file path:", filePath);
  
    try {
      const folder = await Folder.findOne({ checkedFolderName: fileName});
  
      console.log("folders", folder)
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
  
      await folder.save();
  
      res.setHeader('Cache-Control', 'no-store');
      console.log("Resolved file path:", filePath);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File not found at path:', filePath);
          return res.status(404).json({ message: 'File not foundvv' });
        }
  
        res.download(filePath, (err) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ message: 'Error downloading file' });
          }
        });
      });
    } catch (error) {
      console.error('Error fetching folder or file:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }