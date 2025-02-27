import React, { useState } from 'react';
import CategoryList from './CategoryList';
import { formatINR } from '../utils/currency';

const ProductList = ({ products, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div>
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold text-sm sm:text-base">
                  {formatINR(product.price)}
                </span>
                <button
                  onClick={() => onSelectProduct(product)}
                  className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;