import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import Subredext from '../models/subredext.js';

export const getListing = async (req, res) => {
	const { scope = 'user', sort } = req.params;

	// Setting the Query Used for Sorting the Posts

	const sortQuery =
		sort === 'new'
			? { createdAt: -1 }
			: sort === 'hot'
			? { hotScore: -1, createdAt: -1 }
			: { score: -1, createdAt: -1 };

	let sID = null;
	if (scope !== 'all' && scope !== 'user') {
		const link = scope.toLowerCase();
		const subredext = await Subredext.findOne({ link });

		if (!subredext)
			return res.status(404).send({ error: 'Subredext not Found' });

		sID = subredext._id;
	}

	// Setting the Query Used while Retrieving the Posts
	// For Scope 'All' => Find in All Posts
	// For Scope 'User' => Find in All Subs the User is Subscribed to
	// For Scope 'Sub' => Find in the specified Subredext

	let findQuery = {};
	if (scope !== 'all' && scope !== 'user')
		findQuery = { subredext: { $in: sID } };
	if (scope === 'user') {
		const user = await User.findById(req.token.id);
		findQuery = { subredext: { $in: user.subscribed } };
	}

	const { page } = req.query;

	const posts = await Post.find(findQuery)
		.sort(sortQuery)
		.select('_id')
		.skip(page * 10)
		.limit(10);

	const postIds = posts.map((post) => post._id);
	const total = await Post.countDocuments(findQuery);

	res.status(200).send({ data: postIds, count: total });
};

export const getCommentListing = async (req, res) => {
	const { sort } = req.params;
	const { pID, cID = null } = req.query;

	const sortQuery =
		sort === 'new'
			? { createdAt: -1 }
			: sort === 'top'
			? { score: -1, createdAt: -1 }
			: { confidenceScore: -1, createdAt: -1 };

	const findQuery = { post: pID, parent: cID };
	const selectQuery =
		'displayName content score owner deleted post children parent createdAt';

	// 2 Level Deep
	const comments = await Comment.find(findQuery)
		.sort(sortQuery)
		.select(selectQuery)
		.populate({
			path: 'children owner',
			select: selectQuery,

			populate: {
				path: 'children owner',
				select: selectQuery,

				populate: {
					path: 'owner',
					select: 'displayName',
				},
			},
		});

	res.status(200).send(comments);
};
