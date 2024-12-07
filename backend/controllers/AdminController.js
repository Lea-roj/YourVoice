const PostModel = require('../models/PostModel');

module.exports = {

    getReportedPosts: async function (req, res) {
        try {
            const posts = await PostModel.find({ 'reports.0': { $exists: true } })
                .populate('userId', 'username')
                .populate('reports.userId', 'username')
                .exec();

            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while fetching reported posts', error });
        }
    },

    dismissReport: async function (req, res) {
        const { postId, reportId } = req.params;

        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            post.reports = post.reports.filter(
                (report) => report._id.toString() !== reportId
            );

            await post.save();
            res.status(200).json({ message: 'Report dismissed successfully', post });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred', error });
        }
    },

    deleteReportedPost: async function (req, res) {
        const { postId } = req.params;

        try {
            const post = await PostModel.findByIdAndRemove(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred', error });
        }
    }

}

