const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'https://alhproperties-ry5d.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('<h1>Server running</h1>');
});

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

app.post('/submit-form', (req, res) => {
  const formName = req.body['formName'];
  const leadName = req.body['Lead-Name'];
  const leadPhone = req.body['Lead-Phone'];
  const leadEmail = req.body['Lead-Email'];

  const mailOptions = {
    from: leadEmail,
    to: 'sabesofteng@gmail.com',
    subject: `New form submission - ${formName}`,
    html: `<p>Name: ${leadName}</p><p>Email: ${leadEmail}</p><p>Phone: ${leadPhone}</p>`
  };

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

app.post('/submit-brochure', (req, res) => {
  const { LeadName, LeadPhone, LeadEmail } = req.body;

  const mailOptions = {
    from: LeadEmail,
    to: 'sabesofteng@gmail.com',
    subject: 'New brochure download request',
    html: `<p>Name: ${LeadName}</p><p>Email: ${LeadEmail}</p><p>Phone: ${LeadPhone}</p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Form submission successful');
    }
  });
});

app.get('/download-brochure', (req, res) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, 'brochure.pdf');

  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(18).text('Brochure Content', 100, 100);
  doc.end();

  res.download(filePath, 'brochure.pdf', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error sending file');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
