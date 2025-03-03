import { ConfigError } from "../errors";

require("dotenv").config();

export function loadConfig() {
	try {
		const config = {
			password: process.env.DB_PASSWORD,
			user: process.env.DB_USER,
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			port: process.env.PORT,
			pg_port: process.env.PG_PORT,
		};

		for (const [key, value] of Object.entries(config)) {
			if (!value) {
				throw new ConfigError(
					`Config Error please check your environment variables ${key}`,
					500,
				);
			}
		}
		return {
			...config,
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}
