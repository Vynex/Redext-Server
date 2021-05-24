import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
		children: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
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
		confidenceScore: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
