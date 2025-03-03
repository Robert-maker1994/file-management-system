import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileVersionError } from "../../src/errors";
import documentRouter from "../../src/routes/document";
import documentService from "../../src/services/documentService";
import fileVersionService from "../../src/services/fileVersionService";
import localStorageService from "../../src/services/storageService";

vi.mock("../../src/services/documentService");
vi.mock("../../src/services/fileVersionService");
vi.mock("../../src/services/storageService");

const app = express();
app.use(express.json());
app.use("/documents", documentRouter);

describe("documentRouter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create a document with file", async () => {
		const mockDocument = {
			id: 1,
			title: "Test Document",
			description: "Test Description",
			folderId: 1,
		};
		const mockFile = {
			fieldname: "file",
			originalname: "test.txt",
			encoding: "7bit",
			mimetype: "text/plain",
			buffer: Buffer.from("test"),
			size: 4,
		} as Express.Multer.File;
		const mockFilePath = "/uploads/1/test.txt";
		const mockFileVersion = {
			id: 1,
			documentId: 1,
			filePath: mockFilePath,
			version: 1,
			uploadDate: new Date(),
		};

		vi.mocked(documentService.createDocument).mockResolvedValue(mockDocument);
		vi.mocked(localStorageService.uploadFile).mockResolvedValue(mockFilePath);
		vi.mocked(fileVersionService.createFileVersion).mockResolvedValue(
			mockFileVersion,
		);

		const response = await request(app)
			.post("/documents")
			.field("title", "Test Document")
			.field("description", "Test Description")
			.field("folderId", "1")
			.attach("file", mockFile.buffer, "test.txt");

		expect(response.status).toBe(201);
		expect(response.body).toEqual(mockDocument);
		expect(documentService.createDocument).toHaveBeenCalledWith(
			"Test Document",
			"Test Description",
			"1",
		);
	});
	it("should delete a document", async () => {
		vi.mocked(documentService.deleteDocument).mockResolvedValue(true);

		const response = await request(app).delete("/documents/1");

		expect(response.status).toBe(204);
		expect(documentService.deleteDocument).toHaveBeenCalledWith("1");
	});

	it("should delete a document", async () => {
		vi.mocked(documentService.deleteDocument).mockResolvedValue(true);

		const response = await request(app).delete("/documents/1");

		expect(response.status).toBe(204);
		expect(documentService.deleteDocument).toHaveBeenCalledWith("1");
	});

	it("should handle errors when deleting a document", async () => {
		vi.mocked(documentService.deleteDocument).mockRejectedValue(
			new FileVersionError("file not found with that document", 404),
		);
		try {
			await request(app).delete("/documents/1");
		} catch (error) {
			expect(error.status).toBe(404);
			expect(error.message).toBe("file not found with that document");
		}
	});
});
