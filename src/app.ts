import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import launchesRoutes from './routes/router';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/launches', launchesRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;


// @ts-ignore
mongoose.connect(MONGODB_URI).then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}).catch(err => {
	console.error('Error connecting to the database', err);
});

export default app;
