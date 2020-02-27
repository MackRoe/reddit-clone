const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user'); // Credit to LucHighwalker/RedditClone

module.exports = function(app) {
    // CREATE comment
    app.post("/posts/:postId/comments", function(req, res) {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
        comment.author = req.user._id;
        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
            .save()
            .then(comment => {
        // REDIRECT TO THE ROOT
        return Post.findById(req.params.postId);
    })
    .then(post => {
      post.comments.unshift(comment);
      return post.save();  // SAVES the COMMENT to the POST
    })
    .then(post => {
      res.redirect(`/posts/${post._id}`); // REDIRECTS to the POST DETAIL
    })
    .catch(err => {
      console.log(err); // Stops the JavaScript from quitting abruptly
    });
});
  };
