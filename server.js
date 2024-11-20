const express = require('express');
const cors = require('cors');  // Import the CORS middleware
const multer = require('multer'); // File upload middleware
const fs = require('fs');

const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());  // This allows all origins, you can customize this to allow specific origins

// Set up multer for file handling
const upload = multer({ dest: 'uploads/' });  // 'uploads' directory to store files temporarily

// POST route to handle the image upload
app.post('/upload-base64', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image file uploaded');
  }

  // File details are in req.file
  console.log('Uploaded file:', req.file);

  // Read the uploaded file (the image) from the temporary folder
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the uploaded file');
    }

    // Set the appropriate content type (since the uploaded file is an image)
    res.set('Content-Type', 'image/png');  // You can change the type based on the actual image format

    // Send the binary data (the image) as a response
    res.send(data);

    // After sending the response, delete the temporary file
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting the file:', unlinkErr);
      } else {
        console.log('Temporary file deleted');
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
