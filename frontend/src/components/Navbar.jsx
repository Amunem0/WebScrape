// Navbar.js
import React from "react";

const Navbar = ({
  categories,
  onSelectCategory,
  selectedCategory,
  isDarkMode,
  toggleTheme,
}) => {
  return (
    <nav className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} py-3`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <ul className="flex space-x-4">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`cursor-pointer px-3 py-1 rounded ${
                selectedCategory === category
                  ? isDarkMode
                    ? "bg-blue-600 font-semibold"
                    : "bg-blue-500 font-semibold"
                  : isDarkMode
                  ? "text-gray-200 hover:bg-blue-700"
                  : "text-gray-800 hover:bg-blue-200"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
        {/* Dark/Light Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              isDarkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center transition-transform duration-300 ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {isDarkMode ? (
                // Moon Icon for Light Mode (to switch to dark mode)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 116.707 2.707a8.001 8.001 0 0010.586 10.586z" />
                </svg>
                
              ) : (
                

                // Sun Icon for Dark Mode (to switch back to light mode)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
                  <path
                    fillRule="evenodd"
                    d="M10 1a1 1 0 011 1v2a1 1 0 11-2 0V2a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-1.41 1.41a1 1 0 01-1.42-1.42l1.41-1.41zM19 9a1 1 0 110 2h-2a1 1 0 110-2h2zm-2.22 4.78a1 1 0 01-1.42 1.42l-1.41-1.41a1 1 0 011.42-1.42l1.41 1.41zM10 17a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm-4.78-1.22a1 1 0 01-1.42-1.42l1.41-1.41a1 1 0 011.42 1.42l-1.41 1.41zM3 9a1 1 0 110 2H1a1 1 0 110-2h2zm1.22-4.78a1 1 0 011.42-1.42l1.41 1.41a1 1 0 01-1.42 1.42L4.22 4.22z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
