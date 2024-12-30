const Folder = require("../../models/Folder");
const sub_data_types = require("../../models/sub_data_types");
const labeler = require("../../models/user/labeler");

exports.labeler_salary = async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      // Ensure valid dates are provided
      const from = new Date(start_date);
      const to = new Date(end_date);
      to.setHours(23, 59, 59, 999); // Ensure toDate includes the entire day
  
      // Fetch all folders within the specified date range and with status "FINAL CHECKED"
      const folders = await Folder.find({
        createdAt: {
          $gte: from,
          $lte: to
        },
        status: { $in: ["FINAL CHECKED", "CREDITED"] },
      });
  
  
      // Object to hold total salary and counts per labeler
      const labelersData = {};
  
      // Function to calculate total salary for each folder
      const calculateSalary = async (folder) => {
        const { subDataType, totalCorrectLabeledImageCountF = 0 } = folder;
  
        const sub_data_type = await sub_data_types.findById(subDataType);
  
        if (sub_data_type) {
          const pricePerImage = sub_data_type.costPerImage;
          return totalCorrectLabeledImageCountF * pricePerImage;
        }
        return 0;
      };
  
      // Loop through each folder and group data by labeler_id
      for (const folder of folders) {
        const labelerId = folder.assigned_to;
        const LabelerData = await labeler.findById(labelerId);
        console.log("old--lab", LabelerData)
        const labelerName = LabelerData.Name
  
        // Initialize the labeler's data if not already done
        if (!labelersData[labelerName]) {
          labelersData[labelerName] = {
            totalSalary: 0,
          };
        }
  
        // Calculate folder's salary and update labeler's data
        const folderSalary = await calculateSalary(folder);
        labelersData[labelerName].totalSalary += folderSalary;
      }
  
      // Return the salary data for all labelers
      res.json(labelersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }