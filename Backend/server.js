require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    saveUninitialized: true,
    resave: true
  }));
  

  app.use(flash());


app.use(session({
    secret: 'wklbylyc',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => console.log('Connected to Database'));


// Import routes from the routes directory
const userRoutes = require('./routes/userRoutes'); 
const passwordEntryRoutes = require('./routes/passwordEntryRoutes'); 

// Use routes with prefixes for clear API path delineation
app.use('/api/users', userRoutes); 
app.use('/api/passwords', passwordEntryRoutes); 

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
