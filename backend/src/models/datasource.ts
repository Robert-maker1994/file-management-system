import { Sequelize } from "sequelize";
import { loadConfig } from "../config/config";
import { SequelizeConnection } from "../errors";
import DocumentModel from "./document";
import FileVersionModel from "./fileVersion";
import FolderModel from "./folder";

const config = loadConfig();

const datasource = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		host: config.host,
		dialect: "postgres",
		port: Number.parseInt(config.pg_port),
	},
);

try {
	datasource.authenticate();
	console.log("Connection has been established successfully.");
} catch (error) {
	console.error("Unable to connect to the database:", error);
	throw new SequelizeConnection("Unable to connect to the database", 500);
}

const Folder = FolderModel(datasource);
const Document = DocumentModel(datasource);
const FileVersion = FileVersionModel(datasource);

Folder.hasMany(Document, { onDelete: "CASCADE", foreignKey: "folderId" });
Document.belongsTo(Folder, { foreignKey: "folderId" });

Document.hasMany(FileVersion, {
	onDelete: "CASCADE",
	foreignKey: "documentId",
});
FileVersion.belongsTo(Document, { foreignKey: "documentId" });

export { datasource, Folder, Document, FileVersion };
