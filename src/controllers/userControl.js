const User = require ('../models/User');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken')
const Missing = require ('../models/Missing')
const FeedBack = require('../models/Feedback');



const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
    const { fullname, email, phone, password} = req.body;
  
    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = new User({
        fullname, 
        email, 
        phone,
        password: hashedPassword,
      });
  
      await newUser.save();
      res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: 'Could not create user' });
    }
  };
  
  
  exports.updateUser = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.fullname = req.body.fullname || user.fullname;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.street = req.body.street || user.street;
            user.state = req.body.state || user.state;
            user.nationality = req.body.nationality || user.nationality;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
  
  
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
   
    res.json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// const secret = 'YilMwaghavulshang';

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (email === '' || password === '') {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isPasswordValid = await comparePassword(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

//     res.json({
//       success: true,
//       message: 'Login successful',
//       user,
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };






// //Send feedback
exports.submitFeedback = async (req, res) => {
  const { fullname, email, message } = req.body;

  try {
    const newFeedback = new FeedBack({
      fullname,
      email,
      message,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while submitting feedback' });
  }
};


// Get all users
exports.getAllUser = async (req, res) => {
  try {
      const users = await User.find();
      if (users && users.length > 0) {
          res.status(200).json({ success: true, users: users });
      } else {
          res.status(404).json({ success: false, message: "No users available." });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};


exports.countUsers = async (req, res) => {
  try {
      const userCount = await User.countDocuments();
      res.status(200).json({ count: userCount });
  } catch (error) {
      res.status(500).json({ message: 'Failed to count users', error: error.message });
  }
};


exports.countFeedbacks = async (req, res) => {
  try {
      const feedbackCount = await Feedback.countDocuments();
      res.status(200).json({ count: feedbackCount });
  } catch (error) {
      res.status(500).json({ message: 'Failed to count users', error: error.message });
  }
};



// Create a new missing person record
exports.createMissing = async (req, res) => {
  try {
      const missing = new Missing(req.body);
      await missing.save();
      res.status(201).json(missing);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};






function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    return age - 1;
  }

  return age;
}



























































// exports.searchMissing = async (req, res) => {
//   try {
//       // Extract search parameters from the request query
//       const { fullname, gender, age, localGovernment, state, nationality } = req.query;

//       // Constructing the search query based on provided parameters
//       const query = {};
//       if (fullname) query.fullname = { $regex: fullname, $options: 'i' }; // Case-insensitive search for fullname
//       if (gender) query.gender = gender;
//       if (age) query.age = age;
//       if (localGovernment) query.localGovernment = { $regex: localGovernment, $options: 'i' }; // Case-insensitive search for localGovernment
//       if (state) query.state = { $regex: state, $options: 'i' }; // Case-insensitive search for state
//       if (nationality) query.nationality = { $regex: nationality, $options: 'i' }; // Case-insensitive search for nationality

//       // Execute the search query
//       const missingPeople = await Missing.find(query);

//       // Return the search results
//       res.json(missingPeople);
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };





