
const PendingUpdateRequest = require ('../models/Pending');
const User = require ('../models/User');
const Police = require ('../models/Police')
const Criminal = require ('../models/Criminal')
const FeedBack = require ('../models/Feedback');
const News = require('../models/News');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs')
const cloudinary = require ('../utils/cloudinary')
const path = require('path');
// const upload = require('../auth/upload');


exports.createAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true });

    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin2024', 10);

    // Create a new admin user with the hashed password
    const newAdmin = new User({
      fullname: 'Admin User',
      email: 'admin@gmail.com',
      phone: 710002000,
      password: hashedPassword,
      isAdmin: true
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
};


   
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      if (!user.isAdmin) {
          return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }

      const token = jwt.sign({ _id: user._id, isAdmin: true }, "this_is_a_Secret", { expiresIn: '1h' });

      res.json({ success: true, message: 'Admin login successful', user, token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};





  const hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  };

//POLICE CONTROL
exports.addPolice = async (req, res) => {
  try {
      const { fullname, phone, email, password, rank, bloodGroup, DOB, nextOfKin, badgeNumber } = req.body;
      // const image = req.file ? req.file.filename : null;

      const hashedPassword = await hashPassword(password);
    const result = await cloudinary.uploader.upload(req.file.path);
      
      // Create a new police officer instance
      const newPoliceOfficer = new Police({
          fullname,
          phone,
          email,
          password:hashedPassword,
          rank,
          bloodGroup,
          DOB,
          nextOfKin,
          image: result.secure_url,
          // image: 'https://c-man-api.onrender.com/policeImages/' + req.file.filename,
          badgeNumber
      });

      // Save the new police officer to the database
      await newPoliceOfficer.save();

      res.status(201).json({ message: 'Police officer added successfully', data: newPoliceOfficer });
    } catch (error) {
      console.error('Error adding police officer:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Police officer with this email or badge number already exists' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };


// Get all police officers
exports.getAllPolice = async (req, res) => {
  try {
      const police = await Police.find();
      if (police && police.length > 0) {
          res.json({ success: true, policeOfficers: police });
      } else {
          res.status(404).json({ success: false, message: "No police officers available." });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};


// Get a single police record by ID
exports.getPoliceById = async (req, res) => {
  try {
      const police = await Police.findById(req.params.id);
      if (!police) {
          return res.status(404).json({ message: 'Police record not found' });
      }
      res.json(police);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



// Controller for creating a new news article
exports.createNews = async (req, res) => {
  try {
      const { headline, content } = req.body;
      // const image = 'https://c-man-api.onrender.com/uploads/' + req.file.filename;
      const result = await cloudinary.uploader.upload(req.file.path);

      // Create a new news instance
      const newNews = new News({
          headline,
          image: result.secure_url,
          content,
      });

      // Save the news to the database
      await newNews.save();

      // Return success response
      res.status(201).json({ message: 'News added successfully', success: true, news: newNews });
  } catch (error) {
      console.error('Error adding news:', error);
      res.status(500).json({ message: 'Internal server error', success: false });
  }
}
  
  // Controller for retrieving all news articles
  exports.getAllNews = async (req, res) => {
    try {
      const allNews = await News.find();
      res.status(200).json(allNews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller for retrieving a specific news article by ID
  exports.getNewsById = async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  // Get all feedbacks
  exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await FeedBack.find();
        if (feedbacks && feedbacks.length > 0) {
            res.status(200).json({ success: true, feedbacks: feedbacks });
        } else {
            res.status(404).json({ success: false, message: "No feedbacks available." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving feedbacks' });
    }
  };
  

  
  // Delete a missing person record by ID
  exports.deleteMissing = async (req, res) => {
    try {
      const missing = await Missing.findByIdAndDelete(req.params.id);
        if (!missing) {
            return res.status(404).json({ message: 'Missing person record not found' });
        }
        res.json({ message: 'Missing person record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  
  exports.searchMissing = async (req, res) => {
    try {
        // Extract search parameters from the request query
        const { fullname, gender, age, localGovernment, state, nationality } = req.query;
  
        // Constructing the search query based on provided parameters
        const query = {};
        if (fullname) query.fullname = { $regex: fullname, $options: 'i' }; // Case-insensitive search for fullname
        if (gender) query.gender = gender;
        if (age) query.age = age;
        if (localGovernment) query.localGovernment = { $regex: localGovernment, $options: 'i' }; // Case-insensitive search for localGovernment
        if (state) query.state = { $regex: state, $options: 'i' }; // Case-insensitive search for state
        if (nationality) query.nationality = { $regex: nationality, $options: 'i' }; // Case-insensitive search for nationality
  
        // Execute the search query
        const missingPeople = await Missing.find(query);
  
        // Return the search results
        res.json(missingPeople);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  

  

//Deleting a user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
      // Assuming User is your mongoose model/schema
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
          res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};




// Function to delete complaint
exports.deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting complaint' });
  }
};






// Function to delete feedback
exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await FeedBack.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: 'feedback not found' });
    }

    res.status(200).json({ message: 'feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting feedback' });
  }
};



// Delete a police record by ID
exports.deletePolice = async (req, res) => {
  try {
      const police = await Police.findByIdAndDelete(req.params.id);
      if (!police) {
          return res.status(404).json({ message: 'Police record not found' });
      }
      res.json({ message: 'Police record deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// Delete a criminal record
exports.deleteCriminal = async (req, res) => {
  try {
      const criminal = await Criminal.findById(req.params.id);
      if (criminal) {
          await criminal.remove();
          res.json({ message: "Criminal deleted" });
      } else {
          res.status(404).json({ message: "Criminal not found" });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



























// Approve a criminal record by admin  
exports.adminApproveCriminal = async (req, res) => {
  try {
      const criminal = await Criminal.findById(req.params.id);
      if (criminal) {
          criminal.adminApproved = true;
          await criminal.save();
          res.json(criminal);
      } else {
          res.status(404).json({ message: "Criminal not found" });
      }    
  } catch (error) {
      res.status(400).json({ message: error.message });
  }    
};  

