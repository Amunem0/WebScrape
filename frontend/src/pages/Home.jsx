// Home.jsx
import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Define your categories here
  const categories = [
    "All",
    "World",
    "Business",
    "Technology",
    "Future",
    "Politics",
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by category (if not "All")
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (article) =>
          article.categories &&
          article.categories.includes(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article) => {
        return (
          (article.headline &&
            article.headline.toLowerCase().includes(query)) ||
          (article.description &&
            article.description.toLowerCase().includes(query)) ||
          (article.summary &&
            article.summary.toLowerCase().includes(query))
        );
      });
    }

    setFilteredArticles(filtered);
  }, [searchQuery, articles, selectedCategory]);

  return (
    <div
      className={`min-h-screen w-screen overflow-x-hidden flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar
        categories={categories}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <div className="flex-1 w-full">
        <h1 className="text-3xl font-bold text-center my-6">
          Top BBC News
        </h1>
        <div className="flex justify-center px-4 mb-6">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full max-w-lg px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <ArticleCard
                  key={index}
                  article={article}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <p className="text-center col-span-full">No articles found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
