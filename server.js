/*
Basic express server with middleware, SQLite database, and Handlebars template rendering.
*/

//Cntl+C to stop server

var express = require('express');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');

var app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000
app.locals.pretty = true; //to generate pretty view-source code in browser

app.use(logger('dev'));
app.use(express.static(__dirname));
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
}

// GET endpoint - Fetch all reviews
app.get('/api/reviews', (req, res) => {
    try {
        const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
        res.json(reviews);
    } catch (error) {
        console.error('Error reading reviews:', error);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
});

// POST endpoint - Submit a new review
app.post('/api/reviews', (req, res) => {
    try {
        const { name, title, rating, text } = req.body;
        
        // Validation
        if (!name || !rating || !text) {
            return res.status(400).json({ error: 'Name, rating, and review text are required' });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        // Read existing reviews
        const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
        
        // Create new review
        const newReview = {
            id: Date.now().toString(),
            name: name.trim(),
            title: title ? title.trim() : '',
            rating: parseInt(rating),
            text: text.trim(),
            date: new Date().toISOString()
        };
        
        // Add to beginning of array (most recent first)
        reviews.unshift(newReview);
        
        // Save to file
        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
        
        res.status(201).json({ message: 'Review submitted successfully', review: newReview });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Failed to save review' });
    }
});
    
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