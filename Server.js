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

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


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
  