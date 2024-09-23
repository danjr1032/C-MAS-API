const upload = require ('../auth/multer')
const Police = require('../models/Police')
const Criminal = require('../models/Criminal');
const Missing = require ('../models/Missing');
const cloudinary = require ('../utils/cloudinary')
const path = require ('path');

exports.policeLogin = async (req, res) => {
    try{
        const {badgeNumber, password} = req.body;
        const police = await Police.findOne({badgeNumber});
      
        if (!police){
            res.status(404).json("Police not found");
        }
        res.json({ success: true, message: 'Login successful!', police});
        // res.status(201).json({success: true, message: "Police logged in Successfully.", police})
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
  };



  
  exports.createCriminal = async (req, res) => {
    try {
        // Destructure fields from req.body and req.file
        const {
            fullname,
            gender,
            DOB,
            occupation,
            maritalStatus,
            weight,
            height,
            bloodGroup,
            eyeColor,
            address,
            localGovernment,
            state,
            nationality,
            crime,
            contactFullname,
            contactNumber,
            contactAddress,
            contactRelationship,
            dateCommitted,
            dateConvicted,
            sentence
        } = req.body;

        // const image = req.file ? 'https://c-man-api.onrender.com/Criminal/' + req.file.filename : '';
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new criminal instance
        const newCriminal = new Criminal({
            image: result.secure_url,
            fullname: fullname,
            gender: gender,
            DOB: DOB,
            occupation: occupation,
            maritalStatus: maritalStatus,
            weight: weight,
            height: height,
            bloodGroup: bloodGroup,
            eyeColor: eyeColor,
            address: address,
            localGovernment: localGovernment,
            state: state,
            nationality: nationality,
            crime: crime,
            contactFullname: contactFullname,
            contactNumber: contactNumber,
            contactAddress: contactAddress, 
            contactRelationship: contactRelationship,
            dateCommitted: dateCommitted,
            dateConvicted: dateConvicted,
            sentence: sentence
        });

        // Save the new criminal to the database
        const savedCriminal = await newCriminal.save();

        // Respond with success message or saved criminal data
        res.status(201).json({
            message: 'Criminal added successfully',
            savedCriminal
        });
    } catch (error) {
        console.error('Error adding criminal:', error); 
        res.status(500).json({ message: 'Failed to add criminal', error: error.message });
    }
};



exports.updateCriminal = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCriminal = await Criminal.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCriminal) {
            return res.status(404).json({ error: 'Criminal not found' });
        }

        res.status(200).json({ message: 'Criminal updated successfully', criminal: updatedCriminal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}




// Get all criminal records
exports.getAllCriminals = async (req, res) => {
    try {
        const criminals = await Criminal.find();
        res.json(criminals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific criminal record by ID
exports.getCriminalById = async (req, res) => {
    try {
        const criminal = await Criminal.findById(req.params.id);
        if (criminal) {
            res.json(criminal);
        } else {
            res.status(404).json({ message: "Criminal not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete a criminal
exports.deleteCriminalById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCriminal = await Criminal.findByIdAndDelete(id);
        if (deletedCriminal) {
            res.status(200).json({ message: 'Criminal deleted successfully', criminal: deletedCriminal });
        } else {
            res.status(404).json({ message: 'Criminal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete criminal', error: error.message });
    }
};


//delete a Missing person
exports.deleteMissingById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMissing = await Missing.findByIdAndDelete(id);
        if (deletedMissing) {
            res.status(200).json({ message: 'Missing Person deleted successfully', person: deletedMissing });
        } else {
            res.status(404).json({ message: 'Missing Person not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Missing Person', error: error.message });
    }
};




// Approve a criminal record
exports.approveCriminal = async (req, res) => {
    try {
        const criminal = await Criminal.findById(req.params.id);
        if (criminal) {
            criminal.approved = true;
            await criminal.save();
            res.json(criminal);
        } else {
            res.status(404).json({ message: "Criminal not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Adding missing person
exports.addMissing = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newMissing = new Missing({
      image: result.secure_url,
    //   image: 'https://c-man-api.onrender.com/Missing/' + req.file.filename,
      fullname: req.body.fullname,
      gender: req.body.gender,
      age: req.body.age,
      description: req.body.description
      });
    const savedMissing = await newMissing.save();
    
    // Log the received data
    console.log('Received data:', req.body);
    console.log('File:', req.file);

    res.status(201).json(savedMissing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all missing person records
exports.getAllMissing = async (req, res) => {
    try {
        const missingPeople = await Missing.find();
        res.json(missingPeople);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single missing person record by ID
exports.getMissingById = async (req, res) => {
    try {
        const missing = await Missing.findById(req.params.id);
        if (!missing) {
            return res.status(404).json({ message: 'Missing person record not found' });
        }
        res.json(missing);
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



exports.countCriminals = async (req, res) => {
    try {
        const criminalCount = await Criminal.countDocuments();
        res.status(200).json({ count: criminalCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to count users', error: error.message });
    }
  };
exports.countMissing = async (req, res) => {
    try {
        const missingCount = await Missing.countDocuments();
        res.status(200).json({ count: missingCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to count users', error: error.message });
    }
  };