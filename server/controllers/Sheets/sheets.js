const Folder = require("../../models/Folder");
const ExcelJS = require('exceljs');
const administration = require("../../models/user/administration");
const engineer = require('../../models/user/engineer')

exports.sheets = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Set the end date to 23:59:59 to include the entire day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
  
      console.log("sheet date", req.query)
  
      // Find the folders between the specified dates
      const folderForSheet = await Folder.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(adjustedEndDate),
        },
      })
      .populate("assigned_by", "Name")
      .populate("assigned_to", "Name")
      .populate("dataType", "dataTypeName")
      .populate("subDataType", "subDataTypeName")

        //  Manually populate the 'uploaded_by' field based on the role
        const folders = await Promise.all(
          folderForSheet.map(async (folder) => {
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
      console.log("sheet folders", folders)
  
      // Create a new Excel workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Folders');
  
      // Add column headers to the worksheet
      worksheet.columns = [
        { header: 'Folder Name', key: 'folderName', width: 50 },
        { header: 'Data Type', key: 'dataTypeName', width: 20 },
        { header: 'Sub Data Type', key: 'subDataTypeName', width: 20 },
        { header: 'Upload By', key: 'uploadedBy', width: 20 },
        { header: 'Uploaded Date', key: 'createdAt', width: 20 },
        { header: 'Status', key: 'status', width: 20 },
        { header: 'Assigned By Manager', key: 'assignedByName', width: 20 },
        { header: 'Assigned Date', key: 'assignDate', width: 20},
        { header: 'Assigned To Labeler', key: 'assignedToName', width: 20 },
        { header: 'Submitted Date', key: 'submittedDate', width: 20 },
        { header: 'Checked Date', key: 'checkedDate', width: 20 },
        { header: 'Final Checked Date', key: 'finalCheckedDate', width: 20 },
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
          dataTypeName: folder.dataType?.dataTypeName || 'N/A',
          subDataTypeName: folder.subDataType?.subDataTypeName || 'N/A',
          uploadedBy: folder.uploaded_by_name || 'N/A', // Handle case where uploaded_by might be null
          createdAt: folder.createdAt,
          assignedByName: folder.assigned_by?.Name || 'N/A',
          assignDate: folder.assignedDate || 'N/A',
          assignedToName: folder.assigned_to?.Name || 'N/A',
          submittedDate: folder.submittedDate || 'N/A',
          checkedDate: folder.checkedDate || 'N/A',
          finalCheckedDate: folder.finalCheckedDate || 'N/A',
          creditedDate: folder.creditedDate || 'N/A',
          status: folder.status || 'N/A'
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