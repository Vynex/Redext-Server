import express from 'express';
import { isAuthenticated } from '../utils/middleware.js';
import catchAsync from '../utils/catchAsync.js';
import {
	createSub,
	getTopSubs,
	getSubscribedSubs,
} from '../controllers/subredexts.js';
import { getMeta, updateSub, subscribe } from '../controllers/subredext.js';

const router = express.Router();

router.post('/', isAuthenticated, catchAsync(createSub));

router.get('/popular', catchAsync(getTopSubs));
router.get('/subscribed', isAuthenticated, catchAsync(getSubscribedSubs));

router.post('/subscribe', isAuthenticated, catchAsync(subscribe));

router.route('/:title')
	.get(catchAsync(getMeta))
	.patch(isAuthenticated, catchAsync(updateSub));

export default router;
