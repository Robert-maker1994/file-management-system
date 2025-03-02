import { DataTypes, Model, type Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
	class Folder extends Model {
		declare id: number;
		declare name: string;
		declare path: string;
	}

	Folder.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			path: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Folder",
			timestamps: true,
		},
	);

	return Folder;
};
