const Folder = require("../../models/Folder");

exports.assigned_folders_graph = async (req, res) => {
    try {
      // console.log("filter date", req.query);
      const { start_date, end_date, userId } = req.query;
  
      if (!start_date || !end_date) {
        return res.status(400).json({ error: 'From date and to date are required.' });
      }
  
      // Parse the dates as UTC
      const startDate = new Date(start_date + 'T00:00:00Z');
      const endDate = new Date(end_date + 'T23:59:59Z');
  
      // First, find folders by userId
      const userFolders = await Folder.find({
        assigned_to: userId, // Filter by user ID
      });
  
      // console.log("neeee", userFolders)
  
      // Then, filter those folders by the date range
      const filteredFolders = userFolders.filter(folder => {
        const assignedDate = new Date(folder.assignedDate);
        return assignedDate >= startDate && assignedDate <= endDate;
      });
  
      // console.log("filtered folders", filteredFolders);
      res.json(filteredFolders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }