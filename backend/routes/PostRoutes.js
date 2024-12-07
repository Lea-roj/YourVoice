var express = require('express');
var router = express.Router();
var PostController = require('../controllers/PostController.js');

function requiresLogin(req, res, next) {
    console.log('Session:', req.session); // Log session details
    if (req.session && req.session.userId) {
        console.log('User authenticated:', req.session.userId);
        return next();
    } else {
        console.error('Authentication failed');
        var err = new Error('You must be logged in to view this page');
        err.status = 401;
        return next(err);
    }
}


router.get('/', PostController.list);

router.get('/:id', PostController.show);

router.post('/', PostController.create);

router.put('/:id', PostController.update);

router.delete('/:id', PostController.remove);

router.post('/:postId/like', PostController.likePost);
router.post('/:postId/dislike', PostController.dislikePost);

router.post('/:id/comment', PostController.addComment);
router.delete('/:id/comment/:commentId', PostController.removeComment);

router.post('/:postId/report', requiresLogin, PostController.reportPost);

module.exports = router;
