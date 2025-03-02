import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
import multer from "multer";
import documentService from "../services/documentService";
import fileVersionService from "../services/fileVersionService";
import LocalStorageService from "../services/storageService";
import { DocumentError } from "../errors";
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
			const filePath = await new LocalStorageService().uploadFile(
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
			console.log(req.file);
			const filePath = await new LocalStorageService().uploadFile(req.file, id);
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

documentRouter.get("/",
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

documentRouter.get("/:id/download", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const latestVersion = await fileVersionService.getLatestFileVersion(id);
		if (!latestVersion) {
			res.status(404).json({ error: "No file found for this document" });
			return;
		}
		const fileStream = await new LocalStorageService().downloadFile(
			latestVersion.filePath,
		); 
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${latestVersion.filePath.split("/").pop()}"`,
		);
		fileStream.pipe(res);
	} catch (error: any) {
		console.error(error);
		if (error.message === "File not found") {
			res.status(404).json({ error: "File not found" });
		} else {
			res.status(500).json({ error: "File download failed" });
		}
	}
});

documentRouter.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		console.log(id)
		await documentService.deleteDocument(id);
		res.status(204).send();
	} catch (error) {
		
		next(error);
	}
});

export default documentRouter;
