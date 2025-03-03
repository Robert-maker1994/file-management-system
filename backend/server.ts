import "reflect-metadata";
import cors from "cors";
import express from "express";
import methodOverride from "method-override";
import { errorHandler } from "./errorHandle";
import { loadConfig } from "./src/config/config";
import { datasource } from "./src/models/datasource";
import initializeRoutes from "./src/routes/router";
import { seedDatabase } from "./src/seeder/seed";

const config = loadConfig();

datasource
	.sync()
	.then(async () => {
		await seedDatabase();

		const app = express();
		const port = config.port;

		app.use(express.json());
		app.use(cors());

		app.use(express.urlencoded({ extended: true }));
		app.use(methodOverride());

		initializeRoutes(app);
		app.use(errorHandler);

		app.listen(port, () => {
			console.log(`Server listening on port https://localhost:${port}`);
		});
	})
	.catch((err) => {
		throw Error(`Error at the core! ${err}`);
	});
