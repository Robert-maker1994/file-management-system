import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileVersionError } from "../../src/errors";
import { Document, FileVersion, Folder } from "../../src/models/datasource";
import fileVersionService from "../../src/services/fileVersionService";

vi.mock("../../src/models/datasource", () => {
	const MockFileVersion = {
		findByPk: vi.fn(),
		findOne: vi.fn(),
		findAll: vi.fn(),
		create: vi.fn(),
		destroy: vi.fn(),
	};

	const MockDocument = {
		findByPk: vi.fn(),
		create: vi.fn(),
	};
	const MockFolder = {
		create: vi.fn(),
	};

	return {
		FileVersion: MockFileVersion,
		Document: MockDocument,
		Folder: MockFolder,
	};
});
describe("fileVersionService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it("should create a file version", async () => {
		const mockFolder = { id: 1, name: "Test Folder", path: "/test" };
		const mockDocument = {
			id: 1,
			title: "Test Document",
			description: "Test Description",
			folderId: 1,
		};

		const mockFileVersion = {
			id: 1,
			documentId: 1,
			filePath: "/test/file.txt",
			version: 1,
			uploadDate: new Date(),
		};

		Folder.create = vi.fn().mockResolvedValue(mockFolder);
		Document.findByPk = vi.fn().mockResolvedValue(mockDocument);
		FileVersion.findOne = vi.fn().mockResolvedValue(null);
		FileVersion.create = vi.fn().mockResolvedValue(mockFileVersion);

		const fileVersion = await fileVersionService.createFileVersion(
			mockDocument.id.toString(),
			mockFileVersion.filePath,
		);

		expect(fileVersion).toEqual(mockFileVersion);
		expect(Document.findByPk).toHaveBeenCalledWith(mockDocument.id);
		expect(FileVersion.create).toHaveBeenCalledWith({
			documentId: mockDocument.id,
			filePath: mockFileVersion.filePath,
			version: 1,
			uploadDate: expect.any(Date),
		});
	});

	it("should throw an error if the document is missing", async () => {
		Document.findByPk = vi.fn().mockResolvedValue(null);

		await expect(
			fileVersionService.createFileVersion("999", "/test/file.txt"),
		).rejects.toBeInstanceOf(FileVersionError);
	});
});
