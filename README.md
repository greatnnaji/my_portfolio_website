My Portfolio Website

Overview
This is the personal developer portfolio website for Great Nnaji. It's a responsive, single-page site built with HTML, CSS, and JavaScript and showcases projects, experience, and contact information.

Features
- Responsive navigation bar with smooth scrolling to page sections
- Sections: Home, About, Portfolio, Highlights, Contact
- Theme toggle (light/dark) with persisted preference
- Project gallery linking to GitHub repositories
- Contact information and mailto link

Technologies
- HTML5, CSS3
- JavaScript (client-side) and small server for local hosting
- Bootstrap 4.4.1 (CSS + JS)
- Font Awesome 5.10.0
- Google Fonts: Montserrat
- Node.js + Express (used to serve the site locally)
- Dev dependencies: morgan, dotenv (used by the local server)

Run Locally
1. Clone the repository:

	git clone <repository-url>
	cd my_portfolio_website

2. Install dependencies:

	npm install

3. Start the local server:

	npm start

4. Open the site in your browser:

	http://localhost:3000

Notes
- For live-reload during development, you can run `npx nodemon server.js` if `nodemon` is available.
- The site is served from the project root so static assets (index.html, `css/`, `js/`, `img/`) are available directly.

Deployment
The site is hosted at greatnnaji.com

Contact
Use the contact section on the site or email: greatnnaji@cmail.carleton.ca

Files of interest
- `index.html` — main single-page site
- `css/style.css` — primary stylesheet
- `js/main.js` — site JavaScript
- `server.js` — simple Express server for local hosting
