// Setup
const express = require('express')
const app = express()
const port = 3000

/* Mongoose Connection */
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost/reddit-db",
  { useNewUrlParser: true }
);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
mongoose.set("debug", true);

// Middleware
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine','handlebars');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.render('home'))

app.get('/posts/new', (req, res) => res.render('posts-new'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
