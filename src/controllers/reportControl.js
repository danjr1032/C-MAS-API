const Report = require ("../models/Report");
const multer = require('multer');
const path = require ('path')




// Get all complaints
exports.getAllComplaint = async (req, res) => {
    try {
        const reports = await Report.find();
        if (reports && reports.length > 0) {
            res.json({ success: true, complaints: reports });
        } else {
            res.status(404).json({ success: false, message: "No reports available." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getComplaintsByUserId = async (req, res) => {
    try {
        const userId = req.params.userID; 
        const reports = await Report.find({ userId: userId }); 
        if (reports.length > 0) {
            res.json(reports);
        } else {
            res.status(404).json({ message: "No reports found for this user" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCount = async (req, res) => {
    try {
        const userId = req.params.userID; 
        const count = await Report.countDocuments({ userId: userId }); // Count reports by userId
        res.json({ count: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Function to delete complaint
exports.deleteComplaint = async (req, res) => {
    const { id } = req.params;
  
    try {
      const complaint = await Report.findByIdAndDelete(id);
  
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
  
      res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      console.error('Error deleting complaint:', error); 
      res.status(500).json({ error: 'An error occurred while deleting complaint' });
    }
};



exports.countCrimes = async (req, res) => {
    try {
        const crimeCount = await Report.countDocuments();
        res.status(200).json({ count: crimeCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to count crimes', error: error.message });
    }
};