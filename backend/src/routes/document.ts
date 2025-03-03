import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
import multer from "multer";
import { DocumentError } from "../errors";
import documentService from "../services/documentService";
import fileVersionService from "../services/fileVersionService";
import localStorageService from "../services/storageService";
const documentRouter = express.Router();
const upload = multer();

documentRouter.post("/", upload.single("file"), async (req, res, next) => {
	try {
		const { title, description, folderId } = req.body;
		if (req.file) {
			const document = await documentService.createDocument(
				title,
				description,
				folderId,
			);
			const filePath = await localStorageService.uploadFile(
				req.file,
				document.id.toString(),
			);
			await fileVersionService.createFileVersion(
				document.id.toString(),
				filePath,
			);

			res.status(201).send(document);
		}
	} catch (error) {
		next(error);
	}
});

documentRouter.post(
	"/:id/upload",
	upload.single("file"),
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		try {
			if (!req.file) {
				throw new DocumentError("No file uploaded", 404);
			}
			const filePath = await localStorageService.uploadFile(req.file, id);
			const newVersion = await fileVersionService.createFileVersion(
				id,
				filePath,
			);
			res.status(201).json(newVersion);
		} catch (error: any) {
			console.error("Upload Error:", error);
			next(error);
		}
	},
);

documentRouter.get(
	"/",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { folderId } = req.query;
			const documents = await documentService.getAllDocuments(
				folderId as string | undefined,
			);
			res.status(200).json(documents);
		} catch (error) {
			next(error);
		}
	},
);

documentRouter.get(
	"/:id/download",
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		try {
			const latestVersion = await fileVersionService.getLatestFileVersion(id);
			if (!latestVersion) {
				throw new DocumentError("No file found", 404);
			}

			const fileStream = await localStorageService.downloadFile(
				latestVersion.filePath,
			);

			const filename =
				latestVersion.filePath.split("/").pop() || `document_${id}`;

			res.setHeader("Content-Type", "application/octet-stream");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="${filename}"`,
			);
			res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
			fileStream.pipe(res);

			fileStream.on("error", (err) => {
				console.error("Error during file streaming:", err);
				next(err);
			});

			fileStream.on("end", () => {
				console.log("File stream ended successfully");
			});
		} catch (error) {
			next(error);
		}
	},
);

documentRouter.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		console.log(id);
		await documentService.deleteDocument(id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default documentRouter;
