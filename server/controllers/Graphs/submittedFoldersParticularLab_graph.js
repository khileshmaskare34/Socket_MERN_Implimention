const Folder = require("../../models/Folder");

exports.submitted_folders_particular_labeler_graph = async (req, res) => {
    try {
      // console.log("filter date", req.query)
      const { start_date, end_date, userId } = req.query;
  
      if (!start_date || !end_date) {
        return res.status(400).json({ error: 'From date and to date are required.' });
      }
  
      // Parse the dates as UTC
      const startDate = new Date(start_date + 'T00:00:00Z');
      const endDate = new Date(end_date + 'T23:59:59Z');
  
      const userFolders = await Folder.find({
        assigned_to: userId
      })
  
      // Then, filter those folders by the date range
      const folders = userFolders.filter(folder => {
        const submittedDate = new Date(folder.submittedDate);
        return submittedDate >= startDate && submittedDate <= endDate;
      });
  
      // const folders = await Folder.find({
      //   submittedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      // })
  
      // console.log("folders", folders)
      res.json(folders);
    } catch (err) {
      console.error(err);
      res.redirect('/Item')
    }
  }