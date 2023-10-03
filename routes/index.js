
const notes = require("express").Router();
const fs = require("fs");

const express = require("express");

const app = express();
// handles get request
notes.get('/', (req, res) => {
    // log response in terminal
    console.log(`${req.method} request made`);

    // reads from data base and sends data to client
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNotes = JSON.parse(data)
            res.json(parsedNotes)
        }
    })
})

// handles post requests
notes.post('/', (req, res) => {
    // destructure parts of req.body
    const { title, text } = req.body

    //if all required parts are present
    if (title && text) {
      // variable for the object we will save
      const newNote = {
        title,
        text,
      };

      // obtain existing notes
      fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(error);
        } else{
          // convert string to JSON object
          const parsedNotes = JSON.parse(data);

          // add new note
          parsedNotes.push(newNote);

          // write updated note back to file
          fs.writeFile(
            "./db/db.json",
            JSON.stringify(parsedNotes, null, 2),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info("successfully updated reviews!")
          );
        }
      });
      // create response out of newNote
      const response = {
        status: "success",
        body: newNote,
      };
      // send response to client and terminal
      console.log(response);
      res.status(200).json(response);
    } else {
        res.status(500).json('Error in posting note')
    }
    // log response method in terminal
    console.log(`${req.method} request made`)
    
})

// handles delete request
notes.delete('/', (req, res) => {
    // log response in terminal
    console.log(`${req.method} request made`)
})

module.exports = notes;
