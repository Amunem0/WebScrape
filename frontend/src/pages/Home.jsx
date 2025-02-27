import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard.jsx";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((res) => res.json())
      .then((data) => {
        // Assuming the API returns an object with an "articles" array
        setArticles(data.articles);
        setFilteredArticles(data.articles);
      })
      .catch((err) => console.error("Error fetching articles:", err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter((article) => {
        return (
          (article.headline && article.headline.toLowerCase().includes(query)) ||
          (article.description && article.description.toLowerCase().includes(query)) ||
          (article.summary && article.summary.toLowerCase().includes(query))
        );
      });
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top BBC News</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="flex flex-wrap">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
