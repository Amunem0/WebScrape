import React from "react";

const ArticleCard = ({ article, isDarkMode }) => {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 duration-300 flex flex-col ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <img
        className="w-full h-48 object-cover"
        src={article.imageUrl || "https://via.placeholder.com/300x150"}
        alt={article.headline || "Article Image"}
      />
      <div className="p-4 flex-grow">
        <h2 className="font-bold text-xl mb-2">{article.headline}</h2>
        <p className="text-base">
          {article.summary || "No summary available."}
        </p>
        <div className="mt-4 space-y-1">
          <p className="text-sm">
            Last Updated: {article.lastUpdated || "Not available"}
          </p>
          <p className="text-sm">Author: {article.author || "Not available"}</p>
          <p className="text-sm">
            Categories: {article.categories || "Not available"}
          </p>
        </div>
      </div>
      <div className="p-4 border-t">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-center font-bold py-2 px-4 rounded ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
