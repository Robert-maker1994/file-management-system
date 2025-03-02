import { DataTypes, Model, type Sequelize } from "sequelize";
export default (sequelize: Sequelize) => {
	class Document extends Model {
		declare id: number;
		declare title: string;
		declare description: string;
		declare createdAt: Date;
		declare updatedAt: Date;
	}

	Document.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "Document",
			timestamps: true,
		},
	);
	return Document;
};
