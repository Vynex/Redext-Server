import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { JWT_SECRET } from '../configs/server.js';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';

export const register = async (req, res) => {
	const { username, password } = req.body;

	const user = new User({
		displayName: username,
		username: username.toLowerCase(),
		password,
	});

	await user.save();

	const userToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userToken, JWT_SECRET);

	res.status(200).send({
		token,
		displayName: user.displayName,
		id: user._id,
	});
};

export const login = async (req, res) => {
	const username = req.body.username.toLowerCase();
	const password = req.body.password;

	const user = await User.findOne({ username });
	const passwordCorrect =
		user == null ? false : await bcrypt.compare(password, user.password);

	if (!(user && passwordCorrect)) {
		return res.status(401).send({ error: 'Authentication Error' });
	}

	const userToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userToken, JWT_SECRET);

	res.status(200).send({
		token,
		displayName: user.displayName,
		id: user._id,
	});
};

export const getUserInfo = async (req, res) => {
	const user = await User.findById(req.token.id).select('displayName karma');

	res.status(200).send(user);
};

export const getUserPosts = async (req, res) => {
	const posts = await Post.find({ owner: { $in: req.token.id } });

	res.status(200).send(posts);
};

export const getUserComments = async (req, res) => {
	const comments = await Comment.find({ owner: { $in: req.token.id } });

	res.status(200).send(comments);
};

export const getUserUpvotedPosts = async (req, res) => {
	const user = await User.findById(req.token.id);
	const upvoted = user.upvoted;

	res.status(200).send(upvoted);
};

export const getUserDownvotedPosts = async (req, res) => {
	const user = await User.findById(req.token.id);
	const downvoted = user.downvoted;

	res.status(200).send(downvoted);
};

export const getUserUpvotedComments = async (req, res) => {
	const { pID } = req.query;

	const user = await User.findById(req.token.id);

	const upvotedComments = await Comment.find({
		post: { $in: pID },
		upvotes: { $in: user._id },
	});
	const commentIDs = upvotedComments.map((comment) => comment._id);

	res.status(200).send(commentIDs);
};

export const getUserDownvotedComments = async (req, res) => {
	const { pID } = req.query;

	const user = await User.findById(req.token.id);

	const downvotedComments = await Comment.find({
		post: { $in: pID },
		downvotes: { $in: user._id },
	});
	const commentIDs = downvotedComments.map((comment) => comment._id);

	res.status(200).send(commentIDs);
};
