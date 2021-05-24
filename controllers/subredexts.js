import User from '../models/user.js';
import Subredext from '../models/subredext.js';

export const createSub = async (req, res) => {
	const user = await User.findById(req.token.id);

	const { title, description = '' } = req.body;
	const link = title.toLowerCase();

	const subredext = new Subredext({ link, title, description });
	subredext.owner = user._id;

	user.subredexts.push(subredext._id);

	await user.save();
	await subredext.save();

	res.status(201).send(subredext);
};

export const getTopSubs = async (req, res) => {
	const { page } = req.query;

	const subs = await Subredext.find({})
		.sort({ memberCount: -1, updatedAt: -1 })
		.limit(5)
		.skip(page * 5)
		.select('_id title memberCount');

	const total = await Subredext.estimatedDocumentCount();

	res.send({ data: subs, count: total });
};

export const getSubscribedSubs = async (req, res) => {
	const user = await User.findById(req.token.id).populate('subscribed');

	res.status(200).send(user.subscribed);
};
