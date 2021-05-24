import Comment from '../models/comment.js';
import Post from '../models/post.js';
import User from '../models/user.js';

export const getProfileInfo = async (req, res) => {
	const username = req.query.username.toLowerCase();

	const user = await User.findOne({ username })
		.select('displayName postKarma commentKarma createdAt subredexts')
		.populate('subredexts', 'title memberCount');
	if (!user) return res.status(404).send({ error: 'User not Found' });

	res.status(200).send(user);
};

export const getProfilePosts = async (req, res) => {
	const username = req.query.username.toLowerCase();

	const user = await User.findOne({ username });
	if (!user) return res.status(404).send({ error: 'User not Found' });

	const { page } = req.query;

	const findQuery = { owner: user._id };

	const posts = await Post.find(findQuery)
		.sort({ createdAt: -1 })
		.select('_id')
		.skip(page * 10)
		.limit(10);

	const postIds = posts.map((post) => post._id);
	const total = await Post.countDocuments(findQuery);

	res.status(200).send({ data: postIds, count: total });
};

export const getProfileComments = async (req, res) => {
	const username = req.query.username.toLowerCase();

	const user = await User.findOne({ username });
	if (!user) return res.status(404).send({ error: 'User not Found' });

	const { page } = req.query;

	const findQuery = { owner: user._id };

	const comments = await Comment.find(findQuery)
		.select('_id')
		.skip(page * 10)
		.limit(10);

	const commentIds = comments.map((comment) => comment._id);
	const total = await Comment.countDocuments(findQuery);

	res.status(200).send({ data: commentIds, count: total });
};
