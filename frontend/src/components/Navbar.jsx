// Navbar.js
import React from 'react';

const Navbar = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        {categories.map((category) => (
          <li
            key={category}
            className={`text-white cursor-pointer ${selectedCategory === category ? 'font-bold underline' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;