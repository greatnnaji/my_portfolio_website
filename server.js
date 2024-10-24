/*
Basic express server with middleware, SQLite database, and Handlebars template rendering.

The server allows client to find chord progressions of songs in
its SQLite database. The database provided has chord progressions
of some 1200 popular jazz standards.

Here we use server-side templating using the Handlebars template engine to generate the HTML for the response pages to send to the client.
Handlebars is a popular templating format/engine.
Other popular ones include: PUG (formarly Jade), EJS, Liquid, Mustache.
Handlebar views are rendered from data obtained from the SQLite database.

The template engine merges data provided in the form of a javascript object
with html represented in the .hbs handlebars template files.
The combination is 'rendered' and sent to the client as .html.

This is an Express 4.x application.
Here we use a routes module. We put our route handling code in
a separate module that is required by the main app.

We use the exported route functions in the 'use' and 'get'
routes. Typically 'use' calls functions that invoke next() whereas our
get and post routes send responses to the client.

Testing: (user: ldnel password: secret)
http://localhost:3000/index.html
http://localhost:3000/users
http://localhost:3000/find?title=Love
http://localhost:3000/song/372
*/

//Cntl+C to stop server

var http = require('http');
var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
const nodemailer = require('nodemailer');
const multer = require('multer');


var app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000
app.locals.pretty = true; //to generate pretty view-source code in browser

const upload = multer();

//read routes modules
//var routes = require('/index.html');
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services like 'Yahoo', 'Outlook', etc.
    auth: {
    user: 'nnajiuchegreat2004@gmail.com', // Your email address
    pass: 'mxrggoussgrbzjxb'    // Your email password or app-specific password
    }
});


//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(favicon(path.join(__dirname, '/index.html')));
// app.use(function(req, res, next){
//     console.log('-------------------')
//     console.log('req.path: ', req.path)
//     console.log('favicon: ', req.favicon)
//     next()
// })

app.use(logger('dev'));
app.use(express.static(__dirname));
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));


// Handle form submission at '/mail'
app.post('/mail', upload.none(), (req, res) => {
    console.log('request body: ', req.body);
  const { name, email, subject, message } = req.body; // Extract form data

  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);

  const mailOptions = {
        from: email,
        to: 'nnajiuchegreat2004@gmail.com',
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            // Only send response once
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error sending email.' });
        }
        } else {
            console.log('Email sent:', info.response);
            // Only send response once
        if (!res.headersSent) {
            res.json({ message: 'Message received and email sent.' });
        }
        }
    });
    });
    

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('http://localhost:3000')
	}
})