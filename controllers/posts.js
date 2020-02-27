const Post = require('../models/post');
const User = require('../models/user');
module.exports = (app) => {

    // CREATE
    app.get('/posts/new', (req, res) => {
        res.render('posts-new')
    });

      app.post("/posts/new", (req, res) => {
          if (req.user) {
              const post = new Post(req.body);
              post.author = req.user._id;

              post
                  .save()
                  .then(post => {
                      return User.findById(req.user._id);
                  })
                  .then(user => {
                      user.posts.unshift(post);
                      user.save();
                      // REDIRECT TO THE NEW POST
                      res.redirect(`/posts/${post._id}`);
                  })
                  .catch(err => {
                      console.log(err.message);
                  });
          } else {
              return res.status(401); // UNAUTHORIZED
          }
      });

// INDEX Route
app.get('/', (req, res) => {
    console.log('Index Route Accessed')
    const currentUser = req.user;
    // console.log(req.cookies);
    Post.find().populate('author') //.lean()
      .then(posts => {
          console.log('>>> got posts <<<')
          console.log('posts: ' + posts)
          console.log('currentUser: ' + currentUser)
          res.render("posts-index", { posts, currentUser });
    })
      .catch(err => {
        console.log(err.message);
      });
})

// post detail route
app.get("/posts/:id", function(req, res) {
    const currentUser = req.user;
  // LOOK UP THE POST
  Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
            }
        }).populate('author') //.lean()
    .then(post => {
      res.render("posts-show", {
          post,
          currentUser
      });
    })
    .catch(err => {
      console.log(err.message);
    });
});

// SUBREDDIT
app.get("/n/:subreddit", function (req, res) {
    const currentUser = req.user;
  Post.find({ subreddit: req.params.subreddit })
    .then(posts => {
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err);
    });
});


};
