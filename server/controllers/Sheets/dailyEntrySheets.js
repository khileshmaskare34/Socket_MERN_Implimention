const daily_annotator_entries = require("../../models/daily_annotator_entries");
const Folder = require("../../models/Folder");
const ExcelJS = require('exceljs')

exports.daily_entries = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Set the end date to 23:59:59 to include the entire day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
  
      console.log("sheet date", req.query)
  
      // Find the folders between the specified dates
      const folders = await daily_annotator_entries.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(adjustedEndDate),
        },
      })
      .populate("Folder", "folderName")
      .populate("annotator", "Name")
  
      console.log("sheet folders", folders)
  
      // Create a new Excel workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Folders');
  
      // Add column headers to the worksheet
      worksheet.columns = [
        { header: 'Folder Name', key: 'folderName', width: 50 },
        { header: 'Annotator', key: 'annotator', width: 20 },
        { header: 'Total Labeled Image Count', key: 'totalLabeledImageCount', width: 40 },
        
        { header: 'Labeled Image Date', key: 'labeledImageDate', width: 20 },
      ];
  
      // Style the headers (make them bold)
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }; // Make headers bold
        cell.alignment = { horizontal: 'left' }; // Center-align headers
      });
  
      // Add rows to the worksheet
      folders.forEach(folder => {
        const row = worksheet.addRow({
          folderName: folder.Folder.folderName ,
          annotator: folder.annotator.Name || 'N/A',
          totalLabeledImageCount: folder.totalLabeledImageCount || 'N/A',
        
          labeledImageDate: folder.createdAt || 'N/A'
        });
        // Align body rows to the left
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'left' }; // Left-align body data
        });
      });
  
      // Set headers to trigger download of the Excel file
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=folders.xlsx');
  
      // Write the Excel data to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }