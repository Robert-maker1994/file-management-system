import express from "express";
import { CustomError } from "../../errorHandle";
import folderService from "../services/folderService";

const folderRouter = express.Router();

folderRouter.post("/", async (req, res, next) => {
	try {
		const { name } = req.body;
		const folder = await folderService.createFolder(name);
		res.status(201).json(folder);
	} catch (error) {
		next(error);
	}
});

folderRouter.get("/", async (req, res, next) => {
	try {
		const folders = await folderService.getAllFolders();
		res.status(200).json(folders);
	} catch (error) {
		next(error);
	}
});

folderRouter.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const folder = await folderService.getFolderById(id);
		if (!folder) {
			throw new CustomError("Folder not found", 404);
		}
		res.status(200).json(folder);
	} catch (error) {
		next(error);
	}
});

folderRouter.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		await folderService.deleteFolder(id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default folderRouter;
