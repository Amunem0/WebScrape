// ArticleCard.js
import React from "react";

const ArticleCard = ({ article }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img
        className="w-full"
        src={article.imageUrl || "https://via.placeholder.com/300x150"}
        alt={article.headline || "Article Image"}
      />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{article.headline}</h2>
        <p className="text-gray-700 text-base">
          {article.summary || "No summary available."}
        </p>
        <div className="mt-4">
          {article.lastUpdated ? (
            <p className="text-gray-600 text-sm">
              Last Updated: {article.lastUpdated}
            </p>
          ) : (
            <p className="text-gray-600 text-sm">
              Last Updated: Not available
            </p>
          )}
          {article.author ? (
            <p className="text-gray-600 text-sm">Author: {article.author}</p>
          ) : (
            <p className="text-gray-600 text-sm">Author: Not available</p>
          )}
          {article.categories ? (  // New section for categories
            <p className="text-gray-600 text-sm">Categories: {article.categories}</p>
          ) : (
            <p className="text-gray-600 text-sm">Categories: Not available</p>
          )}
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;