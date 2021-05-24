import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import {
	getProfileInfo,
	getProfilePosts,
	getProfileComments,
} from '../controllers/profile.js';

const router = express.Router();

router.get('/', catchAsync(getProfileInfo));
router.get('/posts', catchAsync(getProfilePosts));
router.get('/comments', catchAsync(getProfileComments));

export default router;
