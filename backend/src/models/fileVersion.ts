import { DataTypes, Model, type Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
	class FileVersion extends Model {
		declare id: number;
		declare version: number;
		declare filePath: string;
		declare uploadDate: Date;
	}

	FileVersion.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			filePath: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			version: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			uploadDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "FileVersion",
			timestamps: true,
		},
	);
	return FileVersion;
};
