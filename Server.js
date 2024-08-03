const express = require ( 'express');
const mongoose = require ('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require ('path');
const cors = require('cors')
const multer = require('multer')
// const MongoDBStore = require('connect-mongodb-session')(session);
const adminRouter = require('./src/routes/adminRoute');
const userRouter = require ('./src/routes/userRoute');
const policeRouter = require('./src/routes/policeRoute')
require('dotenv').config();



const app = express();
const allowedOrigins = ['https://c-man-front-end.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow requests with no origin (e.g., mobile apps, curl requests)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true
  }));
  
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'Evidence' directory
app.use('/Evidence', express.static(path.join(__dirname, 'Evidence')));
app.use('/Missing', express.static(path.join(__dirname, 'Missing')));
app.use('/Criminal', express.static(path.join(__dirname, 'Criminal')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/policeImages', express.static(path.join(__dirname, 'policeImages')));


app.use('/', adminRouter);
app.use('/user', userRouter);
app.use('/police', policeRouter);


mongoose.connect(process.env.MONGO_URI, { 
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    
})

.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    });
})
.catch((err) => console.error('Error connecting to MongoDB:', err));
  
  
const port = process.env.PORT;
  