import React from 'react';
import { categories } from '../data/categories';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 px-4">Categories</h2>
      <div className="flex overflow-x-auto pb-2 gap-2 px-4 hide-scrollbar">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-colors ${
            !selectedCategory
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
