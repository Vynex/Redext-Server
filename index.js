import app from './app.js';
import { createServer } from 'http';

import { PORT } from './configs/server.js';

const server = createServer(app);

server.listen(PORT, () => {
	console.info(`Server Listening at Port, ${PORT}`);
});
