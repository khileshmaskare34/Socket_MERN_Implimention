const daily_annotator_entries = require("../../models/daily_annotator_entries");
const Folder = require("../../models/Folder");

exports.total_image_data_for_lab = async (req, res) => {
    const labId = req.query.labId;
    try {
  
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
  
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Last day of the month
        endOfMonth.setHours(23, 59, 59, 999);
  
        // Fetch data from the Folder collection within the current month
        const folders = await Folder.find({
            assigned_to: labId,
            createdAt: { // Assuming 'createdAt' is the field with the date
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

         // Fetch data from the Folder collection within the current month
       const foldersChecked = await Folder.find({
        assigned_to: labId,
        createdAt: { // Assuming 'createdAt' is the field with the date
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        status: 'CHECKED'
      });

      // Fetch data from the Folder collection within the current month
      const foldersFinalChecked = await Folder.find({
        assigned_to: labId,
        createdAt: { // Assuming 'createdAt' is the field with the date
            $gte: startOfMonth,
            $lte: endOfMonth
        },
        status: {$in: ["FINAL CHECKED","CREDITED"]}
      });
  
      const dailyEntriesLabeledImage = await daily_annotator_entries.find({
        annotator: labId,
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      })

        // console.log("floder", folders)
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
        // console.log("totx", folders,  data)
  
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
  }