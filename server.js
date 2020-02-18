// Setup
require('dotenv').config();
let cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');



/* Mongoose Connection */
const mongoose = require("mongoose");


mongoose.Promise = global.Promise;


mongoose.connect(
  "mongodb://localhost/reddit-db",
  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

// Set db
require('./data/reddit-db');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// correctly located after body parser initialization
app.use(expressValidator());

// Use Cookie Parser - located after initialization of express
app.use(cookieParser());



// Middleware
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine','handlebars');
app.use(express.static('public'));

const checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// Routes
app.get('/posts/new', (req, res) => res.render('posts-new'));
app.get('/posts/index', (req, res) => res.render('posts-index'));

// Controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// export for testing
module.exports = app;
