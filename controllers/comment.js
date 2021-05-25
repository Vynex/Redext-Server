import Post from '../models/post.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';
import { calculateScore, calculateConfidenceScore } from '../utils/score.js';

export const getComment = async (req, res) => {
	const { cID } = req.query;

	const comment = await Comment.findById(cID)
		.select(
			'content score owner deleted post children parent createdAt editedAt'
		)
		.populate({
			path: 'owner post',
			select: 'displayName title',
			populate: { path: 'owner subredext', select: 'displayName title' },
		});

	if (!comment) return res.status(404).send({ error: 'Comment not Found' });

	res.status(200).send(comment);
};

export const createComment = async (req, res) => {
	const { pID, cID = null } = req.query;
	const { content } = req.body;

	const comment = new Comment({ content });
	const user = await User.findById(req.token.id);

	comment.owner = user._id;

	const post = await Post.findById(pID);
	if (!post) return res.status(404).send({ error: 'Post not Found' });

	if (cID !== null) {
		const parent = await Comment.findById(cID);
		if (!parent) return res.status(404).send({ error: 'Comment not Found' });

		parent.children.push(comment._id);
		await parent.save();
	}

	post.comments.push(comment._id);
	user.comments.push(comment._id);

	comment.post = post._id;
	comment.parent = cID;

	await user.save();
	await post.save();
	await comment.save();

	const response = await Comment.findById(comment._id)
		.select('displayName content score owner post children parent createdAt')
		.populate('owner', 'displayName');

	res.status(201).send(response);
};

export const voteComment = async (req, res) => {
	const { cID } = req.query;
	const { dir } = req.body;

	const comment = await Comment.findById(cID);
	if (!comment) return res.status(404).send({ error: 'Comment not Found' });

	const user = await User.findById(req.token.id);
	const poster = await User.findById(comment.owner);

	if (comment.upvotes.includes(user._id)) {
		comment.upvotes.pull(user._id);
		user.upvotedComments.pull(comment._id);

		poster.commentKarma = poster.commentKarma - 1;
		await poster.save();
	}

	if (comment.downvotes.includes(user._id)) {
		comment.downvotes.pull(user._id);
		user.downvotedComments.pull(comment._id);

		poster.commentKarma = poster.commentKarma + 1;
		await poster.save();
	}

	if (dir === 1) {
		comment.upvotes.push(user._id);
		user.upvotedComments.push(comment._id);

		poster.commentKarma = poster.commentKarma + 1;
		await poster.save();
	}

	if (dir === -1) {
		comment.downvotes.push(user._id);
		user.downvotedComments.push(comment._id);

		poster.commentKarma = poster.commentKarma - 1;
		await poster.save();
	}

	const ups = comment.upvotes.length;
	const downs = comment.downvotes.length;

	comment.score = calculateScore(ups, downs);
	comment.confidenceScore = calculateConfidenceScore(ups, downs);

	poster.karma = poster.postKarma + poster.commentKarma;

	await user.save();
	await comment.save();
	await poster.save();

	const data = await Comment.findById(cID)
		.select('content score owner createdAt editedAt')
		.populate('owner', 'displayName');

	res.status(200).send(data);
};

export const destroyComment = async (req, res) => {
	const { cID } = req.query;

	const comment = await Comment.findById(cID)
		.select(
			'content score owner deleted post children parent createdAt editedAt'
		)
		.populate({
			path: 'owner post',
			select: 'displayName title',
			populate: { path: 'owner subredext', select: 'displayName title' },
		});

	if (!comment) return res.status(404).send({ error: 'Comment not Found' });

	const user = await User.findById(req.token.id);

	if (!comment.owner.equals(user._id))
		return res.status(403).send({ error: 'Forbidden' });

	comment.deleted = true;
	comment.content = '[deleted]';

	user.comments.pull(comment._id);

	comment.owner = null;

	await comment.save();
	await user.save();

	res.status(200).send(comment);
};
