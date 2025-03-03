import { DocumentServiceError } from "../errors";
import { Document, Folder } from "../models/datasource";
import fileVersionService from "./fileVersionService";
import localStorageService from "./storageService";

const documentService = {
	createDocument: async (
		title: string,
		description: string | undefined,
		folderId: string,
	): Promise<InstanceType<typeof Document>> => {
		if (!title) {
			throw new DocumentServiceError("Document title is required", 404);
		}
		if (!folderId) {
			throw new DocumentServiceError("Folder ID is required", 404);
		}

		const folder = await Folder.findByPk(Number.parseInt(folderId, 10));
		if (!folder) {
			throw new DocumentServiceError("Folder not found", 404);
		}

		const documentData = {
			title,
			description,
			folderId: Number.parseInt(folderId, 10),
		};
		return Document.create(documentData);
	},

	getAllDocuments: async (
		folderId?: string,
	): Promise<InstanceType<typeof Document>[]> => {
		const whereClause = folderId
			? { folderId: Number.parseInt(folderId, 10) }
			: {};
		return Document.findAll({ where: whereClause });
	},

	getDocumentById: async (
		id: string,
	): Promise<InstanceType<typeof Document> | null> => {
		return Document.findByPk(Number.parseInt(id, 10));
	},

	deleteDocument: async (id: string) => {
		const document = await Document.findByPk(Number.parseInt(id));
		if (!document) {
			throw new DocumentServiceError("Document not found", 404);
		}
		const fileVersions = await fileVersionService.getAllFileVersions(id);
		for (const fileVersion of fileVersions) {
			await fileVersionService.deleteFileVersion(fileVersion.id);
			await localStorageService.deleteFile(fileVersion.filePath);
		}

		await document.destroy();
		return true;
	},
};

export default documentService;
