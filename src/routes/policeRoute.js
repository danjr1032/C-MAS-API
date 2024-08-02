const express = require('express');
const {policeLogin, createCriminal, getAllCriminals, countMissing,countCriminals,getCriminalById, addMissing, getAllMissing, getMissingById, updateCriminal, deleteCriminalById} = require('../controllers/policeControl');
const{getAllComplaint, countCrimes,updateComplaint, getComplaintById, deleteComplaint} = require ('../controllers/reportControl');
const policeRouter = express.Router();
const multer = require('multer')
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 



// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'Missing');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const missing = multer({
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
  }).single('image');
  
  policeRouter.post('/addMissing', missing, addMissing);






// Set up multer for file uploads
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Criminal');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const criminal = multer({
  storage: Storage,
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
}).single('image');








//police route
policeRouter.post('/login', policeLogin);

//criminal route
policeRouter.post('/addCriminal', criminal,createCriminal);
policeRouter.get('/criminals', getAllCriminals);
policeRouter.get('/criminal/:id', getCriminalById);
policeRouter.get('/allMissing', getAllMissing);
policeRouter.get('/count', countCrimes);
policeRouter.get('/count', countCriminals);
policeRouter.get('/count', countMissing);


policeRouter.put('/complaint/:id',updateComplaint);
policeRouter.put('/criminal/:id',updateCriminal);
policeRouter.get('/complaints/:id',getComplaintById);
policeRouter.post('/getSingleMissing', getMissingById);
policeRouter.get('/complaints', getAllComplaint);
policeRouter.delete('/complaints/:id', deleteComplaint);
policeRouter.delete('/criminal/:id', deleteCriminalById);



//news route



module.exports = policeRouter;