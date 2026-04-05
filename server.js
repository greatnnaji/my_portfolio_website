/*
Basic express server for serving the static portfolio site locally.
*/

//Cntl+C to stop server

var express = require('express');
var logger = require('morgan');

var app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000
app.locals.pretty = true; //to generate pretty view-source code in browser

app.use(logger('dev'));
app.use(express.static(__dirname)); //serve static files from root folder. i.e index.html, css/, js/, images/ etc 
// Middleware to parse URL-encoded form data
//app.use(express.urlencoded({ extended: true })); // parses form data --> unused
// Middleware to parse JSON data
app.use(express.json());

// run for live changes: npx nodemon server.js

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('http://localhost:3000')
	}
})