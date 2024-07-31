import request from 'supertest';
import mongoose from 'mongoose';
import Launch from '../src/models/Launch';
import express, {Application} from "express";
import dotenv from "dotenv";
import {deleteLaunch, getSavedLaunches, saveLaunch} from "../src/controllers/launchController"; // Adjust the path according to your project structure

dotenv.config();
const app: Application = express();
app.use(express.json());
app.get('/api/launches', getSavedLaunches);
app.post('/api/launches', saveLaunch);
app.delete('/api/launches/:id', deleteLaunch);

const testLaunch = {
	flight_number: 1,
	name: 'Falcon 1',
	date_utc: '2022-12-01T00:00:00.000Z'
};

const MONGODB_URI = process.env.MONGODB_URI;

beforeAll(async () => {
	// Connect to the test database
	const url = MONGODB_URI+'/launches_test';
	// @ts-ignore
	await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
	// Clean up after tests
	await mongoose.connection.close();
});

describe('Launches API', () => {
	beforeEach(async () => {
		// Clear the launches collection before each test
		await Launch.deleteMany({});
	});

	it('should fetch saved launches', async () => {
		// Insert a launch to test the fetch
		const launch = new Launch(testLaunch);
		await launch.save();

		const response = await request(app)
			.get('/api/launches')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body.length).toBe(1);
		expect(response.body[0]).toMatchObject(testLaunch);
	});

	it('should create a new launch', async () => {
		const response = await request(app)
			.post('/api/launches')
			.send(testLaunch)
			.expect('Content-Type', /json/)
			.expect(201);

		expect(response.body).toMatchObject(testLaunch);

		const launches = await Launch.find();
		expect(launches.length).toBe(1);
	});

	it('should delete a launch', async () => {
		// Insert a launch to test the delete
		const launch = new Launch(testLaunch);
		await launch.save();

		const response = await request(app)
			.get('/api/launches')
			.expect('Content-Type', /json/)
			.expect(200);

		const launchId = response.body[0]._id;

		await request(app)
			.delete(`/api/launches/${launchId}`)
			.expect(204);

		const launches = await Launch.find();
		expect(launches.length).toBe(0);
	});

	it('should return 500 if there is an error fetching launches', async () => {
		jest.spyOn(Launch, 'find').mockImplementationOnce(() => {
			throw new Error('Error fetching launches');
		});

		const response = await request(app)
			.get('/api/launches')
			.expect('Content-Type', /json/)
			.expect(500);

		expect(response.body.message).toBe('Error fetching launches');
	});

	it('should return 500 if there is an error saving a launch', async () => {
		jest.spyOn(Launch.prototype, 'save').mockImplementationOnce(() => {
			throw new Error('Error saving launch');
		});

		const response = await request(app)
			.post('/api/launches')
			.send(testLaunch)
			.expect('Content-Type', /json/)
			.expect(500);

		expect(response.body.message).toBe('Error saving launch');
	});

	it('should return 500 if there is an error deleting a launch', async () => {
		jest.spyOn(Launch, 'findByIdAndDelete').mockImplementationOnce(() => {
			throw new Error('Error deleting launch');
		});

		const launch = new Launch(testLaunch);
		await launch.save();
		const launchId = launch._id;

		const response = await request(app)
			.delete(`/api/launches/${launchId}`)
			.expect('Content-Type', /json/)
			.expect(500);

		expect(response.body.message).toBe('Error deleting launch');
	});
});
