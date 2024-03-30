require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => console.log('Connected to Database'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
  
  app.get('/about', (req, res) => {
    res.send('This is the about page.');
  });



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });