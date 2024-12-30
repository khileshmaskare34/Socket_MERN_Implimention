const Folder = require("../../models/Folder");
const ExcelJS = require('exceljs')

exports.salary_sheets = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Set the end date to 23:59:59 to include the entire day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); 
  
      console.log("sheet date", req.query)
  
      // Find the folders between the specified dates
      const folders = await Folder.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(adjustedEndDate),
        },
        status: { $in: ["FINAL CHECKED", "CREDITED"] },
      })
      .populate("assigned_by", "Name")
      .populate("assigned_to", "Name")
      .populate("dataType", "dataTypeName")
      .populate("subDataType", "subDataTypeName")
  
      console.log("sheet folders", folders)
  
      // Create a new Excel workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Folders');
  
      // Add column headers to the worksheet
      worksheet.columns = [
        { header: 'Folder Name', key: 'folderName', width: 50 },
        { header: 'Annotator', key: 'annotator', width: 20 },

        { header: 'Labeled Image', key: 'labeledImage', width: 20 },
        { header: 'Checked Labeled Image', key: 'checkedLabeledImage', width: 30 },
        { header: 'Final Labeled Image', key: 'finalCheckedLabeledImage', width: 30 },

        { header: 'Submitted Date', key: 'submittedDate', width: 20 },
        { header: 'Checked Date', key: 'checkedDate', width: 20 },
        { header: 'Final Checked Date', key: 'finalCheckedDate', width: 20 },

        { header: 'Submitted Based Salary', key: 'submittedBasedSalary', width: 30 },
        { header: 'Checked Based Salary', key: 'checkedBasedSalary', width: 30},
        { header: 'Final Checked Based Salary', key: 'salary', width: 30 },
        { header: 'Updated Salary', key: 'updatedSalary', width: 20},

        { header: 'Credite', key: 'credite', width: 20 },
        { header: 'Credited Date', key: 'creditedDate', width: 20 },
      ];
  
      // Style the headers (make them bold)
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }; // Make headers bold
        cell.alignment = { horizontal: 'left' }; // Center-align headers
      });
  
      // Add rows to the worksheet
      folders.forEach(folder => {
        const row = worksheet.addRow({
          folderName: folder.folderName,
          annotator: folder.assigned_to?.Name || 'N/A',

          labeledImage: folder.totalLabeledImageCount || 'N/A',
          checkedLabeledImage: folder.totalCorrectLabeledImageCountNF || 'N/A',
          finalCheckedLabeledImage: folder.totalCorrectLabeledImageCountF || 'N/A',

          submittedDate: folder.submittedDate || 'N/A',
          checkedDate: folder.checkedDate || 'N/A',
          finalCheckedDate: folder.finalCheckedDate || 'N/A',

          submittedBasedSalary: folder.submissionBasedSalary || 'N/A',
          checkedBasedSalary: folder.checkedBasedSalary || 'N/A',
          salary: folder.salary || 'N/A',
          updatedSalary: folder.updatedSalary || 'N/A',

          credite: folder.status === "CREDITED" ? "Yes" : "No",
          creditedDate: folder.creditedDate || 'N/A',
  
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