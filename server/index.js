const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple endpoint to list uploaded images (first page)
app.get("/images", async (req, res) => {
  try {
    // List up to 100 uploaded resources. For more, iterate with next_cursor.
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      max_results: 100,
    });

    const images = (result.resources || []).map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      created_at: r.created_at,
    }));

    res.json({ images });
  } catch (err) {
    console.error("Error fetching images from Cloudinary:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
