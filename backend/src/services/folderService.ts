import { Folder } from "../models/datasource";

const folderService = {
	createFolder: async (name: string): Promise<InstanceType<typeof Folder>> => {
		if (!name) {
			throw new Error("Folder name is required");
		}

		const path = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.replace(/-{2,}/g, "-");

		return Folder.create({ name, path });
	},

	getAllFolders: async (): Promise<InstanceType<typeof Folder>[]> => {
		return Folder.findAll();
	},

	getFolderById: async (
		id: string,
	): Promise<InstanceType<typeof Folder> | null> => {
		return Folder.findByPk(Number.parseInt(id));
	},

	deleteFolder: async (id: string) => {
		const folder = await Folder.findByPk(Number.parseInt(id));
		if (!folder) {
			throw new Error("Folder not found");
		}
		folder.destroy();
	},
};

export default folderService;
