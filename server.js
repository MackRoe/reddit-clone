// Setup
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');




/* Mongoose Connection */
const mongoose = require("mongoose");


mongoose.Promise = global.Promise;
// mongoose.connect(
//   url,
//   {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
// )
mongoose.connect(
  "mongodb://localhost/reddit-db",
  { useNewUrlParser: true }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

// Set db
require('./data/reddit-db');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

require('./controllers/posts.js')(app);

// Middleware
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine','handlebars');
app.use(express.static('public'));

// Routes
// app.get('/', (req, res) => res.render('home'))

app.get('/posts/new', (req, res) => res.render('posts-new'));

app.get('/posts/index', (req, res) => res.render('posts-index'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
