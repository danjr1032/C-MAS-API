const express = require ('express');
const {create, updateUser, login, countUsers,submitFeedback} = require ('../controllers/userControl');
const { getAllComplaint, getCount,getComplaintsByUserId} = require ("../controllers/reportControl");
// const cloudinary = require("../utils/cloudinary");
const Report = require ('../models/Report');
const User = require('../models/User')
const {getAllNews} = require ('../controllers/adminControl');
const {getAllMissing} = require ('../controllers/policeControl');
const multer = require('multer')
const path = require('path');
const userRouter = express.Router();




//user route
userRouter.post('/signup', create);
userRouter.post('/login', login);
userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
      } else {
        res.send('Logged out successfully');
      }
    });
  });


userRouter.put('/profileUpdate/:id',updateUser);

userRouter.post('/feedback', submitFeedback);
userRouter.get('/news', getAllNews);
userRouter.get('/missing', getAllMissing);
userRouter.get('/count', countUsers);
userRouter.get('/complaints/count/:userId', getCount);



//report route
userRouter.get("/Complaints/:id", getAllComplaint)
userRouter.get("/reports/:userId", getComplaintsByUserId)

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Evidence');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).single('evidence');


// Route for submitting a complaint

userRouter.post('/complaint/:id', upload, async (req, res) => {
  try {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const { crime, location, description } = req.body;
    const { id: userID } = req.params;

    console.log('Received data:', req.body);
    console.log('File:', req.file);

    if (!crime || !location || !description || !req.file) {
      return res.status(400).json({ error: 'All fields are required: crime, location, description, evidence' });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newReport = new Report({
      crime,
      location,
      description,
      // evidence: result.secure_url,
      evidence: 'http://localhost:7000/Evidence/' + req.file.filename,
      userID
    });

    const savedReport = await newReport.save();

    res.status(201).json({ 
      message: 'Report submitted successfully', 
      report: savedReport,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = userRouter;
