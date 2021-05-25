import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		editedAt: {
			type: Date,
		},
		subredext: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subredext',
		},
		upvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		downvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		score: {
			type: Number,
			default: 0,
		},
		upvoteRatio: {
			type: Number,
			default: 0,
		},
		hotScore: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Post', postSchema);
