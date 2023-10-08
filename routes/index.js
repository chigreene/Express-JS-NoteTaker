
const notes = require("express").Router();
const fs = require("fs");
const uuid = require('uuid')

const express = require("express");

const app = express();

// handles get request
notes.get('/', (req, res) => {

  // reads from data base and sends data to client
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  });

  // log response in terminal
  console.log(`${req.method} request made to ${req.path}`);
})

// handles post requests
notes.post('/', (req, res) => {
    // destructure parts of req.body
    const { title, text } = req.body

    //if all required parts are present
    if (title && text) {
      // variable for the object we will save
      const newNote = {
        id: uuid.v4(),
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
                : console.info("successfully updated data base with new note!")
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
    console.log(`${req.method} request made to ${req.path}`)
    
})

// handles delete request
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;

  // Read the existing notes from the JSON file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json("Error reading notes");
    } else {
      try {
        // Parse the JSON data into an array of notes
        const parsedNotes = JSON.parse(data);

        // Find the index of the note with the specified ID
        const noteIndex = parsedNotes.findIndex((note) => note.id === noteId);

        if (noteIndex !== -1) {
          // Remove the note from the array
          parsedNotes.splice(noteIndex, 1);

          // Write the updated notes back to the JSON file
          fs.writeFile(
            "./db/db.json",
            JSON.stringify(parsedNotes, null, 2),
            (writeErr) => {
              if (writeErr) {
                console.error(writeErr);
                res.status(500).json("Error updating notes");
              } else {
                console.info("Note deleted successfully from data base");
                res
                  .status(200)
                  .json("Note deleted successfully deleted from data base");
              }
            }
          );
        } else {
          // If the note with the specified ID was not found, respond with an error
          console.error(`Note with ID ${req.params.id} not found`);
          res.status(404).json("Note not found");
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).json("Error parsing notes");
      }
    }
  });

  // Log the HTTP method and requested note ID
  console.log(`${req.method} request made for note ID: ${req.params.id}`);
});

module.exports = notes;
