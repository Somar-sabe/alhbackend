const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'https://alhproperties-ry5d.vercel.app/', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow only specified methods
  credentials: true, // Allow including cookies in requests (if using sessions/cookies)
}));

app.post('/submit-floorplan-form', (req, res) => {
  const leadName = req.body['Lead-Name'];
  const leadPhone = req.body['Lead-Phone'];
  const leadEmail = req.body['Lead-Email'];

  console.log(`Received floorplan form submission - Name: ${leadName}, Phone: ${leadPhone}, Email: ${leadEmail}`);

  
  res.status(200).send('Form submission successful');
});


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'sabesofteng@gmail.com', 
    pass: '0934491127sS' 
  }
});

// Handle form submissions
app.post('/submit-form', (req, res) => {
  const formName = req.body['formName']; 
  const leadName = req.body['Lead-Name'];
  const leadPhone = req.body['Lead-Phone'];
  const leadEmail = req.body['Lead-Email'];

  // Create an email content based on the form data
  const mailOptions = {
    from: leadEmail,
    to: 'sabesofteng@gmail.com', 
    subject: `New form submission - ${formName}`,
    html: `<p>Name: ${leadName}</p><p>Email: ${leadEmail}</p><p>Phone: ${leadPhone}</p>`
  };

  // Send the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Form submission successful');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
