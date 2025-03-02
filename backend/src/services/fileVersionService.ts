import { FileVersionError } from "../errors";
import { Document, FileVersion } from "../models/datasource";




const fileVersionService = {
	createFileVersion: async (
		documentId: string,
		filePath: string,
	): Promise<InstanceType<typeof FileVersion>> => {
		const document = await Document.findByPk(Number.parseInt(documentId, 10));
		if (!document) {
			throw new FileVersionError("Document not found", 404);
		}

		const latestVersion = await FileVersion.findOne({
			where: { documentId: Number.parseInt(documentId, 10) },
			order: [["version", "DESC"]],
		});

		const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;

		const fileVersionData = {
			documentId: Number.parseInt(documentId, 10),
			filePath,
			version: newVersionNumber,
			uploadDate: new Date(),
		};

		return FileVersion.create(fileVersionData);
	},

	getLatestFileVersion: async (
		documentId: string,
	): Promise<InstanceType<typeof FileVersion> | null> => {
		return FileVersion.findOne({
			where: { documentId: Number.parseInt(documentId) },
			order: [["version", "DESC"]],
		});
	},

	getAllFileVersions: async (
		documentId: string,
	): Promise<InstanceType<typeof FileVersion>[]> => {
		return FileVersion.findAll({
			where: { documentId: Number.parseInt(documentId) },
			order: [["version", "DESC"]],
		});
	},

	getFileVersionById: async (
		id: string,
	): Promise<InstanceType<typeof FileVersion> | null> => {
		return FileVersion.findByPk(Number.parseInt(id));
	},

	deleteFileVersion: async (id: string) => {
		const fileVersion = await FileVersion.findByPk(Number.parseInt(id));
		console.log(fileVersion)
		if (!fileVersion) {
			throw new FileVersionError("File version not found", 404);
		}

		const d = await fileVersion.destroy();
		console.log(d)
		return true
	},
};

export default fileVersionService;
