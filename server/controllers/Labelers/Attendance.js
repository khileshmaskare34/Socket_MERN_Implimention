const Clock = require("../../models/clockInClockOut");

exports.clock_in = async (req, res) => {
    const { userId, clockInTime } = req.body;
  
    console.log("clockinData : ", req.body)
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const existingClockIn = await Clock.findOne({
        userId,
        clockInTime: {$gte: startOfDay}
      })
  
      console.log("existingClockIn :", existingClockIn)
      if(existingClockIn){
        return res.status(400).json({ message: 'You have already clocked in today.'})
      }
  
      // Save the new clock-in time as a new record
      const clock = new Clock({ userId, clockInTime, status: "CLOCKED_IN" });
      await clock.save();
      res.status(201).json({ message: 'Clock in time recorded' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

exports.clock_out = async (req, res) => {
    const { userId, clockOutTime } = req.body;
  
    try {
        // Find the most recent clock-in where clockOutTime is null (user has clocked in but not clocked out)
        const clock = await Clock.findOne({
            userId,
            clockOutTime: null // look for the clock-in entry without a clock-out time
        });
  
        if (!clock) {
            return res.status(404).json({ message: 'No active clock-in found' });
        }
  
        clock.clockOutTime = clockOutTime,
        clock.status = "CLOCKED_OUT"
        await clock.save();
        res.status(200).json({ message: 'Clock out time recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
  }  


exports.break_start = async (req, res) => {
    const { userId, breakStartTime } = req.body;
  
    try {
      // Find the active clock-in record where the user is clocked in but not clocked out
      const clock = await Clock.findOne({
        userId,
        clockOutTime: null, // ensure the user hasn't clocked out yet
      });
  
      if (!clock) {
        return res.status(404).json({ message: 'No active clock-in found' });
      }
  
      clock.breaks.push({ breakStartTime }),
      clock.status = "BREAK"
      await clock.save();
      res.status(201).json({ message: 'Break started' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }


exports.break_end = async (req, res) => {
    const { userId, breakEndTime } = req.body;
  
    try {
      // Find the active clock-in record where the user is clocked in and on a break
      const clock = await Clock.findOne({
        userId,
        clockOutTime: null, // ensure the user hasn't clocked out yet
        "breaks.breakEndTime": null, // ensure the user is on a break
      });
  
      if (!clock) {
        return res.status(404).json({ message: 'No active break found' });
      }
  
      // Update the last break record with the end time
      const lastBreak = clock.breaks[clock.breaks.length - 1];
      lastBreak.breakEndTime = breakEndTime;
      clock.status = "CLOCKED_IN"
      await clock.save();
  
      res.status(200).json({ message: 'Break ended' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }