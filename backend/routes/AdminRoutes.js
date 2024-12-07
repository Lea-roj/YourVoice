import router from "./index";
import AdminController from "../controllers/AdminController";

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/admin/reported-posts', requiresLogin, AdminController.getReportedPosts);
router.post('/admin/reported-posts/:postId/dismiss/:reportId', requiresLogin, AdminController.dismissReport);
router.delete('/admin/reported-posts/:postId', requiresLogin, AdminController.deleteReportedPost);

module.exports = router;
