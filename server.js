import express from "express";
import cloudinary from './public/cloudinary.js';
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));

app.get("/api/images", async (req, res) => {
	try {
		const result = await cloudinary.search
			.expression("resource_type:image")
			.sort_by("created_at", "desc")
			.max_results(50)
			.execute();
		
		console.log(result.total_count + " images found.");
		res.json(result.resources);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/folders", async (req, res) => {
	try {
		// Get all folders at the root level
		const result = await cloudinary.api.sub_folders("/", { recursive: true });
		// result is an array of folders with paths
		res.json(result.folders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
