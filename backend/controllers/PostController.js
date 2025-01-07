var PostModel = require('../models/PostModel');
var CommentModel = require('../models/CommentModel');

/**
 * PostController.js
 *
 *
 * @description :: Server-side logic for managing Posts.
 */

module.exports = {
  list: function (req, res) {
    PostModel.find()
      .populate('userId', 'username') // Dodano za pridobitev username polja iz User modela
      .exec(function (err, Posts) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting Post.',
            error: err,
          });
        }
        return res.json(Posts);
      });
  },

  // Posodobljena metoda za prikaz posamezne objave
  show: function (req, res) {
    var id = req.params.id;

    PostModel.findOne({ _id: id })
      .populate('userId', 'username') // Populacija za prikaz avtorja
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username' }, // Populacija uporabnikov v komentarjih
      })
      .exec(function (err, post) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting Post.',
            error: err,
          });
        }

        if (!post) {
          return res.status(404).json({
            message: 'No such Post',
          });
        }

        return res.json(post);
      });
  },

  create: function (req, res) {
    console.log(req.body.title);
    console.log(req.body);
    console.log("AAAA".req);

    var newPost = new PostModel({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      userId: req.body.userId,
      photoPath : req.file?.filename ? "/images/"+req.file.filename : null,
    });

    newPost.save(function (err, Post) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating Post',
          error: err,
        });
      }
      return res.status(201).json(Post);
    });
  },

  update: function (req, res) {
    var id = req.params.id;

    PostModel.findOne({ _id: id }, function (err, post) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting post',
          error: err,
        });
      }

      if (!post) {
        return res.status(404).json({
          message: 'No such post',
        });
      }

      post.title = req.body.title ? req.body.title : post.title;
      post.content = req.body.content ? req.body.content : post.content;
      post.category = req.body.category ? req.body.category : post.category;
      post.photoPath = req.file.filename ? "/images/"+req.file.filename : post.category;
      post.save(function (err, post) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating post.',
            error: err,
          });
        }

        return res.json(post);
      });
    });
  },

  remove: function (req, res) {
    var id = req.params.id;

    PostModel.findByIdAndRemove(id, function (err, Post) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the Post.',
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  addComment: async function (req, res) {
    const postId = req.params.id;

    // Preveri, ali so potrebni podatki prisotni
    if (!req.body.content || !req.body.userId) {
      return res.status(400).json({
        message: 'Content and userId are required',
      });
    }

    try {
      const newComment = new CommentModel({
        content: req.body.content,
        userId: req.body.userId,
      });

      const comment = await newComment.save();
      console.log('Saved Comment:', comment);

      // Dodaj komentar v objavo
      const post = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      )
        .populate('comments')
        .exec();

      // console.log('Updated Post with New Comment:', post);
      return res.status(201).json(post);
    } catch (err) {
      console.log('Error:', err.message || err);
      return res.status(500).json({
        message: 'Error when creating comment or updating post',
        error: err.message || err,
      });
    }
  },

  removeComment: async function (req, res) {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    try {
      const comment = await CommentModel.findByIdAndRemove(commentId);

      if (!comment) {
        return res.status(404).json({
          message: 'No such comment',
        });
      }

      const post = await PostModel.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { new: true }
      )
        .populate('comments')
        .exec();

      return res.status(204).json(post);
    } catch (err) {
      console.log('Error:', err.message || err);
      return res.status(500).json({
        message: 'Error when deleting comment or updating post',
        error: err.message || err,
      });
    }
  },


  likePost: async function (req, res) {
    const { postId } = req.params;
    const { username } = req.body;

  
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      // Remove from downvoteUsers if already downvoted
      post.downvoteUsers = post.downvoteUsers.filter(user => user !== username);

      // Add to upvoteUsers if not already liked
      if (!post.upvoteUsers.includes(username)) {
        post.upvoteUsers.push(username);
      }

  
      post.upvotes = post.upvoteUsers.length; // Update the upvotes count
      post.downvotes = post.downvoteUsers.length; // Update the downvotes count
  
      await post.save();
      res.status(200).json({ message: 'Post liked successfully', post });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error });
    }
  },
  
  // Dislike post
  dislikePost: async function (req, res) {
    const { postId } = req.params;
    const { username } = req.body;
  
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Remove from upvoteUsers if already upvoted
      post.upvoteUsers = post.upvoteUsers.filter(user => user !== username);
  
      // Add to downvoteUsers if not already disliked
      if (!post.downvoteUsers.includes(username)) {
        post.downvoteUsers.push(username);
      }
  
      post.upvotes = post.upvoteUsers.length; // Update the upvotes count
      post.downvotes = post.downvoteUsers.length; // Update the downvotes count
  
      await post.save();
      res.status(200).json({ message: 'Post disliked successfully', post });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error });
    }
  }
};
