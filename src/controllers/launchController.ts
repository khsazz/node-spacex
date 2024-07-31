import { Request, Response } from 'express';
import Launch from '../models/Launch';

export const getSavedLaunches = async (req: Request, res: Response) => {
	try {
		const launches = await Launch.find();
		res.json(launches);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ message: error.message });
	}
};

export const saveLaunch = async (req: Request, res: Response) => {
	const { flight_number, name, date_utc } = req.body;

	try {
		const newLaunch = new Launch({ flight_number, name, date_utc });
		await newLaunch.save();
		res.status(201).json(newLaunch);
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ message: error.message });
	}
};

export const deleteLaunch = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await Launch.findByIdAndDelete(id);
		res.status(204).json({ message: 'Launch deleted' });
	} catch (error) {
		// @ts-ignore
		res.status(500).json({ message: error.message });
	}
};
