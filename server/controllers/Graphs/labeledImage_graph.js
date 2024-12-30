const daily_annotator_entries = require("../../models/daily_annotator_entries");

exports.labeled_image_graph = async (req, res) => {
    // console.log("grafffData", req.query);
  
    const { start_date, end_date } = req.query;
  
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "Start date and End date are required." });
    }
  
    // Parse the date as UTC
    const startDate = new Date(start_date + 'T00:00:00Z');
    const endDate = new Date(end_date + 'T23:59:59Z');
  
    try {
      const folders = await daily_annotator_entries.find({
        createdAt: { $gte: startDate, $lte: endDate }
      })
      .populate('Folder', 'folderName')
      .populate('annotator', 'Name')
      .exec();
  
      // const folderId = folders.Folder.folderName;
      // console.log("_Di", folders)
     
  
      // Calculate the total labeled images for each annotator
      const labeledImages = folders.reduce((acc, folder) => {
        const annotatorId = folder.annotator._id.toString();
        const annotatorName = folder.annotator.Name;
        // const folderName = folder.Folder.folderName;
  
        if (!acc[annotatorId]) {
          acc[annotatorId] = {
            annotatorName,
            // folderName,
            totalLabeledImageCount: 0,
          };
        }
  
        acc[annotatorId].totalLabeledImageCount += folder.totalLabeledImageCount;
  
        return acc;
      }, {});
  
      // console.log("Filtered folders and labeled images", labeledImages);
  
      res.json(Object.values(labeledImages));
    } catch (error) {
      console.error("Error fetching folders", error);
      res.status(500).json({ error: "Error fetching data." });
    }
  }