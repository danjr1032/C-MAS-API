const express = require('express');
const adminRouter = express.Router();
const { createAdmin, adminLogin, addPolice,getAllPolice, getPoliceById} = require('../controllers/adminControl');
const {createNews, getAllNews, getNewsById, addComment, deleteUserById, deleteComplaint, deleteFeedback, getAllFeedback, deletePolice, deleteNews} = require ("../controllers/adminControl");
const{getAllComplaint, countCrimes,getComplaintById} = require('../controllers/reportControl');
const {getAllUser, countUsers, countFeedbacks} = require ('../controllers/userControl');
const multer = require('multer')
const path = require('path');
// const policeImage =require('../auth/multer');


  


//admin route
adminRouter.post('/admini/SignUp', createAdmin);
adminRouter.post('/admini/login', adminLogin);

//manage police
// Set up multer for file uploads
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'policeImages');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const policeImage = multer({
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

adminRouter.post('/admini/police/registerPolice', policeImage, addPolice);
adminRouter.get('/admini/allPolice', getAllPolice);

adminRouter.get('/admini/allUsers', getAllUser);


//news route
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const news = multer({
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

adminRouter.post('/admini/addNews', news,createNews);
adminRouter.get('/admini/allNews', getAllNews);
adminRouter.get('/admini/getNews/:id', getNewsById);

//reports
adminRouter.get('/admini/complaints', getAllComplaint);
adminRouter.get('/admini/feedbacks', getAllFeedback);
adminRouter.get('/admini/reportCount', countCrimes);
adminRouter.get('/admini/userCount', countUsers);
adminRouter.get('/admini/feedbackCount', countFeedbacks);

// Usage with route
adminRouter.delete('/admini/user/:id', deleteUserById);
adminRouter.delete('/admini/complaint/:id', deleteComplaint);
adminRouter.delete('/admini/feedback/:id', deleteFeedback);
adminRouter.delete('/admini/police/:id', deletePolice);
adminRouter.delete('/admini/news/:id', deleteNews);


module.exports = adminRouter;
 