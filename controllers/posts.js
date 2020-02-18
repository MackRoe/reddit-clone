const Post = require('../models/post');

module.exports = (app) => {

  // CREATE
  app.post('/posts/new', (req, res) => {
      if(req.user){
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);

    // SAVE INSTANCE OF POST MODEL TO DB
    post.save((err, post) => {
        console.log(err);
        console.log(post);
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
        });
    } else {
        return res.status(401); // UNAUTHORIZED
    }
  });

// Index Route
app.get('/', (req, res) => {
    let currentUser = req.user;

    Post.find({})
      .then(posts => {
        res.render("posts-index", { posts, currentUser });
    })
      .catch(err => {
        console.log(err.message);
      });
})

// post detail route
app.get("/posts/:id", function(req, res) {
    let currentUser = req.user;
  // LOOK UP THE POST
  Post.findById(req.params.id).populate('comments')
    .then(post => {
      res.render("posts-show", { post });
    })
    .catch(err => {
      console.log(err.message);
    });
});

// SUBREDDIT
// SUBREDDIT
app.get("/n/:subreddit", function(req, res) {
    let currentUser = req.user;
  Post.find({ subreddit: req.params.subreddit })
    .then(posts => {
      res.render("posts-index", { posts });
    })
    .catch(err => {
      console.log(err);
    });
});


};
