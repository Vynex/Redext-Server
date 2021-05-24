import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		displayName: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		// Posts
		upvoted: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		downvoted: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		// Comments
		upvotedComments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		downvotedComments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		subredexts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Subredext',
			},
		],
		subscribed: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Subredext',
			},
		],
		postKarma: {
			type: Number,
			default: 0,
		},
		commentKarma: {
			type: Number,
			default: 0,
		},
		karma: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

export default mongoose.model('User', userSchema);
