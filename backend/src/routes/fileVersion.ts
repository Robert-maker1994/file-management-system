import express from "express";
import { FileVersionError } from "../errors";
import fileVersionService from "../services/fileVersionService";

const fileVersionRouter = express.Router();

fileVersionRouter.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const fileVersion = await fileVersionService.getFileVersionById(id);
		if (!fileVersion) {
			throw new FileVersionError("File version not found", 404);
		}
		res.status(200).json(fileVersion);
	} catch (error) {
		next(error);
	}
});

fileVersionRouter.get("/document/:documentId", async (req, res, next) => {
	try {
		const { documentId } = req.params;
		const fileVersions =
			await fileVersionService.getAllFileVersions(documentId);
		res.status(200).json(fileVersions);
	} catch (error) {
		next(error);
	}
});

fileVersionRouter.get(
	"/document/:documentId/latest",
	async (req, res, next) => {
		try {
			const { documentId } = req.params;

			const fileVersion =
				await fileVersionService.getLatestFileVersion(documentId);
			if (!fileVersion) {
				throw new FileVersionError("No file found", 404);
			}
			res.status(200).json(fileVersion);
		} catch (error) {
			next(error);
		}
	},
);

fileVersionRouter.get("/document/:documentId", async (req, res, next) => {
	try {
		const { documentId } = req.params;
		const fileVersions =
			await fileVersionService.getAllFileVersions(documentId);
		res.status(200).json(fileVersions);
	} catch (error) {
		next(error);
	}
});

fileVersionRouter.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		await fileVersionService.deleteFileVersion(id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default fileVersionRouter;
