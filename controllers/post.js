import Subredext from '../models/subredext.js';
import User from '../models/user.js';
import Post from '../models/post.js';
import { calculateScore, calculateHotScore } from '../utils/score.js';

export const getPost = async (req, res) => {
	const { pID } = req.query;

	const post = await Post.findById(pID)
		.select('-hotScore -upvotes -downvotes -updatedAt -__v')
		.populate('subredext owner', 'title displayName');

	if (!post) return res.status(404).send({ error: 'Post not Found' });

	res.status(200).send(post);
};

export const createPost = async (req, res) => {
	const { sID } = req.query;
	const { title, content } = req.body;

	const subredext = await Subredext.findById(sID);
	const user = await User.findById(req.token.id);

	if (!subredext) return res.status(404).send({ error: 'Subredext not Found' });

	const post = new Post({ title, content, subredext: sID });
	post.owner = user._id;

	user.posts.push(post._id);
	subredext.posts.push(post);

	await post.save();
	await user.save();
	await subredext.save();

	res.status(201).send(post);
};

export const updatePost = async (req, res) => {
	const { pID } = req.query;

	const post = await Post.findById(pID)
		.select('-hotScore -upvotes -downvotes -updatedAt -__v')
		.populate('subredext owner', 'title displayName');

	if (!post) return res.status(404).send({ error: 'Post not Found' });

	if (!post.owner.equals(req.token.id))
		return res.status(403).send({ error: 'Forbidden' });

	const newContent = req.body.content;

	post.content = newContent;
	post.editedAt = Date.now();

	await post.save();

	res.status(200).send(post);
};

export const votePost = async (req, res) => {
	const { pID } = req.query;
	const { dir } = req.body;

	const post = await Post.findById(pID);
	if (!post) return res.status(404).send({ error: 'Post not Found' });

	const user = await User.findById(req.token.id);
	const poster = await User.findById(post.owner);

	if (post.upvotes.includes(user._id)) {
		post.upvotes.pull(user._id);
		user.upvoted.pull(post._id);

		poster.postKarma--;
		await poster.save();
	}

	if (post.downvotes.includes(user._id)) {
		post.downvotes.pull(user._id);
		user.downvoted.pull(post._id);

		poster.postKarma++;
		await poster.save();
	}

	if (dir === 1) {
		post.upvotes.push(user._id);
		user.upvoted.push(post._id);

		poster.postKarma++;
		await poster.save();
	}

	if (dir === -1) {
		post.downvotes.push(user._id);
		user.downvoted.push(post._id);

		poster.postKarma--;
		await poster.save();
	}

	const ups = post.upvotes.length;
	const downs = post.downvotes.length;
	const date = post.createdAt.getTime();

	post.upvoteRatio = ups / (ups + downs) || 0;

	post.score = calculateScore(ups, downs);
	post.hotScore = calculateHotScore(ups, downs, date);

	poster.karma = poster.postKarma + poster.commentKarma;

	await user.save();
	await post.save();
	await poster.save();

	const data = await Post.findById(pID)
		.select('title content score upvoteRatio subredext owner createdAt')
		.populate('owner subredext', 'displayName title');

	res.status(200).send(data);
};
