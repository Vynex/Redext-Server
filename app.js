import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { dbURL } from './configs/server.js';

import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import subredextRoutes from './routes/subredexts.js';
import listingRoutes from './routes/listings.js';

const app = express();

mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

mongoose.connection.on(
	'error',
	console.error.bind(console, 'Mongoose Connection Error, ')
);
mongoose.connection.once('open', () => {
	console.info('Connection to the Database Established');
});

app.use(express.json());
app.use(cors());

app.use('/api/', userRoutes);
app.use('/api/profiles', profileRoutes);

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use('/api/subredexts', subredextRoutes);
app.use('/api/listings', listingRoutes);

export default app;
