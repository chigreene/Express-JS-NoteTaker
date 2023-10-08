// require express, path, and fs
const express = require('express');
const path = require('path');

// accesses routes folder and create variable notes to handle requests for /notes route
const notes = require('./routes/index.js')

// add PORT variable to listen on 3001 or the assigned port from HEROKU
const PORT = process.env.PORT || 3001

// create an instance of express and call it app
const app = express()

// middleware to tell the app to expect JSON and allow it to use encoded url requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// add route for router
app.use('/api/notes', notes)

// middleware to serve static folder
app.use(express.static('public'))

// GET route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.js'))
);

// GET route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// tells the server to start listening on a designated port or a static port if not given a port to listen to
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}!`);
})
