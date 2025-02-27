import express from 'express';
import cors from 'cors';
import { scrapeBBCNews } from './scraper/scraper.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/news", async (req, res) => {
  try {
    const articles = await scrapeBBCNews();
    res.json({ articles });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
