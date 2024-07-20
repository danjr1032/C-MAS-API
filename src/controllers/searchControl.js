
const Criminal = require('../models/Criminal.js')
const User = require ('../models/User.js')
const Police = require ('../models/Police.js')
const Report = require ('../models/Report.js')
const Missing = require('../models/Missing.js')


export const Search = async (req, res) => {
  try {
    // Get the search term from the request body
    const search = req.body.search;
    const regex = new RegExp(search, 'i');

    // Perform searches in parallel using Promise.all
    const searchedItems = await Promise.all([
      searchCriminal(search, regex),
      searchUser(search, regex),
      searchOfficer(search, regex),
      searchMissing(search, regex),
      searchReport(search, regex),
    ]);

    // Flatten the results and remove any falsy values
    const persons = searchedItems.flat().filter(Boolean);

    if (persons.length === 0) {
      // If no matching persons found, return an error message
      return res.status(404).json({ error: 'No matching user found' });
    }

    // Return the search results
    res.json(persons);
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search criminals by fullname, address, crime, or dateConvicted
async function searchCriminal(search, regex) {
  return Criminal.find({
    $or: [
      { fullname: regex },
      { address: search },
      { crime: search },
      { dateConvicted: search },
    ],
  }).exec();
}

// Search User by fullname, phone, or email
async function searchUser(search, regex) {
  return User.find({
    $or: [
      { fullname: regex },
      { phone: search },
      { email: search },
    ],
  }).exec();
}

// Search officers by fullname, badgeNumber, policeID, or rank
async function searchOfficer(search, regex) {
  return Police.find({
    $or: [
      { fullname: regex },
      { badgeNumber: search },
      { rank: search },
      { policeID: search},
    ],
  }).exec();
}

// Search missing peron by fullname,state, missingID
async function searchMissing(search, regex) {
  return Missing.find({
    $or: [
      { fullname: regex },
      { state: regex },
      { missingID: search },
      
    ],
  }).exec();
}



// Search Report by crimeType, reportBy
async function searchReport(search, regex) {
    return Report.find({
      $or: [
        { crimeType: regex },
        { reportedBy: regex },
      ],
    }).exec();
  }
  
  