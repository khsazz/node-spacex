import { Schema, model } from 'mongoose';

const launchSchema = new Schema({
	flight_number: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	date_utc: { type: Date, required: true },
});

const Launch = model('Launch', launchSchema);

export default Launch;
