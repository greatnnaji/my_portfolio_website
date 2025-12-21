/*
Basic express server with middleware, SQLite database, and Handlebars template rendering.
*/

//Cntl+C to stop server

var express = require('express');
var logger = require('morgan');


var app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000
app.locals.pretty = true; //to generate pretty view-source code in browser

app.use(logger('dev'));
app.use(express.static(__dirname));
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
    
// run for live changes: node server.js

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('http://localhost:3000')
	}
})