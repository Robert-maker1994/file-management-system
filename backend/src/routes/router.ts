import type core from "express";
import documentRouter from "./document";
import fileVersionRouter from "./fileVersion";
import folderRouter from "./folder";
import healthRouter from "./health";

export default function initializeRoutes(app: core.Express) {
	app.use("/health", healthRouter);
	app.use("/folders", folderRouter);
	app.use("/documents", documentRouter);
	app.use("/file-versions", fileVersionRouter);
}
