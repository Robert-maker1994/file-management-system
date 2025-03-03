import { Document, FileVersion, Folder } from "../models/datasource";

export const seedDatabase = async () => {
	try {
		const folderCount = await Folder.count();
		if (folderCount > 0) {
			console.log("Database already seeded.");
			return;
		}

		const folder1 = await Folder.create({
			name: "Project Files",
			path: "/project-files",
		});
		const folder2 = await Folder.create({
			name: "Personal Documents",
			path: "/personal-documents",
		});

		const doc1 = await Document.create({
			title: "Project Report",
			description: "Final report for Q3",
			folderId: folder1.id,
		});

		const doc2 = await Document.create({
			title: "Meeting Notes",
			description: "Notes from the team meeting",
			folderId: folder1.id,
		});

		const doc3 = await Document.create({
			title: "Resume",
			description: "My updated resume",
			folderId: folder2.id,
		});

		await FileVersion.create({
			filePath: "uploads/1/example1.txt",
			version: 1,
			documentId: doc1.id,
			uploadDate: new Date(),
		});

		await FileVersion.create({
			filePath: "uploads/2/cv.txt",
			version: 1,
			documentId: doc2.id,
			uploadDate: new Date(),
		});

		await FileVersion.create({
			filePath: "uploads/3/example.txt",
			version: 1,
			documentId: doc3.id,
			uploadDate: new Date(),
		});

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};
