import express from "express";
import cloudinary from './public/cloudinary.js';

const app = express();
const port = 3000;


app.use(express.static('public'));

app.get("/api/images", async (req, res) => {
	try {
		const result = await cloudinary.search
			.expression("resource_type:image")
			.sort_by("created_at", "desc")
			.max_results(50)
			.execute();
		
		res.json(result.resources);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/folders", async (req, res) => {
	try {
		const result = await cloudinary.api.sub_folders("/", { recursive: true });

		res.json(result.folders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
