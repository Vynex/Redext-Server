import User from '../models/user.js';
import Subredext from '../models/subredext.js';

export const getMeta = async (req, res) => {
	const { title } = req.params;
	const link = title.toLowerCase();

	const subredext = await Subredext.findOne({ link }).select(
		'-members -link -posts -updatedAt -__v'
	);

	if (!subredext) return res.status(404).send({ error: 'Subredext not Found' });

	res.send(subredext);
};

export const updateSub = async (req, res) => {
	const { title } = req.params;
	const link = title.toLowerCase();

	const subredext = await Subredext.findOne({ link }).select(
		'-members -link -posts -updatedAt -__v'
	);
	if (!subredext) return res.status(404).send({ error: 'Subredext not Found' });

	const user = await User.findById(req.token.id);
	if (!subredext.owner.equals(user._id))
		return res.status(403).send({ error: 'Unauthorised' });

	const newDescription = req.body.description;

	subredext.description = newDescription;

	await subredext.save();

	res.status(200).send(subredext);
};

export const subscribe = async (req, res) => {
	const { id } = req.query;

	const subredext = await Subredext.findById(id);

	if (!subredext) return res.status(404).send({ error: 'Subredext not Found' });

	const user = await User.findById(req.token.id);

	if (!user.subscribed.includes(subredext._id)) {
		subredext.members.push(user._id);
		user.subscribed.push(subredext._id);
	} else {
		subredext.members.pull(user._id);
		user.subscribed.pull(subredext._id);
	}

	subredext.memberCount = subredext.members.length;

	await user.save();
	await subredext.save();

	res.status(200).send(subredext);
};
