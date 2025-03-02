import express from "express";
import type { Request, Response } from "express";

const healthRouter = express.Router();

healthRouter.get("/", (req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
});

export default healthRouter;
