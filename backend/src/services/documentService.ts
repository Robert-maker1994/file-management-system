import { DocumentServiceError } from "../errors";
import { Document, Folder } from "../models/datasource";


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
		console.log(document)
		if (!document) {
			throw new DocumentServiceError("Document not found", 404);
		}

		const d = await document.destroy();
		console.log(d)
		return true
	},
};

export default documentService;
