import mongoose from 'mongoose';

const subSchema = new mongoose.Schema(
	{
		link: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		memberCount: {
			type: Number,
			default: 0,
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Subredext', subSchema);
