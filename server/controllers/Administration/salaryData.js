const Folder = require("../../models/Folder");
const sub_data_types = require("../../models/sub_data_types");

exports.salary_data = async(req, res)=>{
    try {
      // Calculate the start and end of the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
  
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);
      endOfMonth.setDate(0); // Last day of the month
      endOfMonth.setHours(23, 59, 59, 999);
  
      // Calculate the start and end of the previous month
      const startOfPrevMonth = new Date(startOfMonth);
      startOfPrevMonth.setMonth(startOfMonth.getMonth() - 1);
  
      const endOfPrevMonth = new Date(startOfMonth);
      endOfPrevMonth.setDate(0); // Last day of the previous month
      endOfPrevMonth.setHours(23, 59, 59, 999);
  
  
      // Fetch data from the Folder collection for the current month
      const currentMonthFolders = await Folder.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        },
        status: {$in : ["FINAL CHECKED", "CREDITED"]}  
      });
      
  
      // Fetch data from the Folder collection for the previous month
      const previousMonthFolders = await Folder.find({
        creditedDate: {
          $gte: startOfPrevMonth,
          $lte: endOfPrevMonth
        },
        status: "CREDITED"
      });

      const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // Fetch data from the Folder collection for the previous month
        const previousMonthPending = await Folder.find({
          finalCheckedDate: {
            $lte: startOfCurrentMonth
          },
          status: "FINAL CHECKED"
        });
    
  
      // Function to calculate total salary for folders
      const calculateSalary = async (folders) => {
        let totalSalary = 0;
  
        for (const folder of folders) {
          const { subDataType, totalCorrectLabeledImageCountF = 0 } = folder;
  
          const sub_data_type = await sub_data_types.findById(subDataType);
  
          if (sub_data_type) {
            const pricePerImage = sub_data_type.costPerImage;
            const folderSalary = totalCorrectLabeledImageCountF * pricePerImage;
            totalSalary += folderSalary;
          }
        }
  
        return totalSalary;
      };
  
      // Calculate salary for both months
      const currentMonthSalary = await calculateSalary(currentMonthFolders);
      const previousMonthSalary = await calculateSalary(previousMonthFolders);
      const previousMonthPendingSalary = await calculateSalary(previousMonthPending);

  
       // Calculate image counts for the current month
       const totalImageCount = currentMonthFolders.reduce((acc, folder) => acc + (folder.totalImageCount || 0), 0);
       const totalLabeledImageCount = currentMonthFolders.reduce((acc, folder) => acc + (folder.totalLabeledImageCount || 0), 0);
       const totalNonFinalImageCount = currentMonthFolders.reduce((acc, folder) => acc + (folder.totalCorrectLabeledImageCountNF || 0), 0);
       const totalFinalImageCount = currentMonthFolders.reduce((acc, folder) => acc + (folder.totalCorrectLabeledImageCountF || 0), 0);

      const data ={
        currentMonth: {
          totalImageCount,
          totalLabeledImageCount,
          totalNonFinalImageCount,
          totalFinalImageCount,
          totalSalary: currentMonthSalary
        },
        previousMonth: {
          totalSalary: previousMonthSalary,
          previousMonthPendingSalary: previousMonthPendingSalary
        }
      }
  
      res.json(data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
  }
  }