import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomError } from "../../errorHandle";
import folderRouter from "../../src/routes/folder";
import folderService from "../../src/services/folderService";

vi.mock("../../src/services/folderService");

const app = express();
app.use(express.json());
app.use("/folders", folderRouter);

describe("folderRouter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should get all folders", async () => {
		const mockFolders = [
			{ id: 1, name: "Folder 1", path: "/folder1" },
			{ id: 2, name: "Folder 2", path: "/folder2" },
		];
		vi.mocked(folderService.getAllFolders).mockResolvedValue(mockFolders);

		const response = await request(app).get("/folders");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockFolders);
		expect(folderService.getAllFolders).toHaveBeenCalled();
	});

	it("should get a folder by id", async () => {
		const mockFolder = { id: 1, name: "Test Folder", path: "/test" };
		vi.mocked(folderService.getFolderById).mockResolvedValue(mockFolder);

		const response = await request(app).get("/folders/1");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockFolder);
		expect(folderService.getFolderById).toHaveBeenCalledWith("1");
	});

	it("should return 404 if folder not found", async () => {
		vi.mocked(folderService.getFolderById).mockResolvedValue(null);
		try {
			await request(app).get("/folders/999");
		} catch (response) {
			expect(response.status).toBe(404);
			expect(response.body.error).toBe("Folder not found");
			expect(response.body.message).toBeInstanceOf(CustomError);
		}
	});
});
