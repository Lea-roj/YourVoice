var express = require('express');
var router = express.Router();
var PostController = require('../controllers/PostController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', PostController.list);

router.get('/:id', PostController.show);

router.post('/',upload.single('image'), PostController.create);

router.put('/:id',upload.single('image'), PostController.update);

router.delete('/:id', PostController.remove);

router.post('/:postId/like', PostController.likePost);
router.post('/:postId/dislike', PostController.dislikePost);

router.post('/:id/comment', PostController.addComment);
router.delete('/:id/comment/:commentId', PostController.removeComment);

module.exports = router;