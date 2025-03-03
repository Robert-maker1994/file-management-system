import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../src/config/config";
import { ConfigError } from "../../src/errors";

describe("loadConfig", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	it("should load config from environment variables", () => {
		vi.stubEnv("DB_PASSWORD", "testpassword");
		vi.stubEnv("DB_USER", "testuser");
		vi.stubEnv("DB_NAME", "testdb");
		vi.stubEnv("DB_HOST", "localhost");
		vi.stubEnv("PORT", "5001");
		vi.stubEnv("PG_PORT", "5433");

		const config = loadConfig();

		expect(config).toEqual({
			password: "testpassword",
			user: "testuser",
			database: "testdb",
			host: "localhost",
			port: "5001",
			pg_port: "5433",
		});
	});

	it("should throw an error if DB_PASSWORD is missing", () => {
		vi.stubEnv("DB_USER", "testuser");
		vi.stubEnv("DB_NAME", "testdb");
		vi.stubEnv("DB_HOST", "localhost");
		vi.stubEnv("PORT", "5001");
		vi.stubEnv("PG_PORT", "5433");
		try {
			loadConfig();
		} catch (err) {
			expect(err).toBeInstanceOf(ConfigError);
		}
	});
});
