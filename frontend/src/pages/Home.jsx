// Home.jsx
import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard.jsx";
import Navbar from "../components/Navbar"; // Adjust the import based on your file structure

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Updated categories
  const categories = ["All", "World", "Business", "Technology", "Future", "Politics"]; // Define your categories here

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
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(article => article.categories.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article) => {
        return (
          (article.headline && article.headline.toLowerCase().includes(query)) ||
          (article.description && article.description.toLowerCase().includes(query)) ||
          (article.summary && article.summary.toLowerCase().includes(query))
        );
      });
    }

    setFilteredArticles(filtered);
  }, [searchQuery, articles, selectedCategory]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top BBC News</h1>
      <Navbar categories={categories} onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
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