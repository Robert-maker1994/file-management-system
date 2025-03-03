import fs from "fs";
import path from "path";
import type { Readable } from "stream";
import { StorageServiceError } from "../errors";

interface StorageService {
	uploadFile(file: Express.Multer.File, documentId: string): Promise<string>;
	downloadFile(filePath: string): Promise<Readable>;
	deleteFile(filePath: string): Promise<void>;
}

const localStorageService = {
	async uploadFile(
		file: Express.Multer.File,
		documentId: string,
	): Promise<string> {
		const uploadPath = path.join(__dirname, `../../uploads/${documentId}`);
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		const filePath = path.join(
			uploadPath,
			`${Date.now()}-${file.originalname}`,
		);
		const relativeFilePath = path.relative(
			path.join(__dirname, "../../"),
			filePath,
		);
		fs.writeFileSync(filePath, file.buffer);
		return relativeFilePath;
	},

	async downloadFile(filePath: string): Promise<Readable> {
		const fullPath = path.join(__dirname, "../../", filePath);

		if (!fs.existsSync(fullPath)) {
			throw new StorageServiceError("File not found", 404);
		}

		return fs.createReadStream(fullPath);
	},

	async deleteFile(filePath: string): Promise<void> {
		const fullPath = path.join(__dirname, "../../", filePath);
		try {
			if (fs.existsSync(fullPath)) {
				fs.unlinkSync(fullPath);
			}
		} catch (error: any) {
			throw new StorageServiceError(
				`Error deleting file: ${error.message}`,
				500,
			);
		}
	},
};

export default localStorageService;
