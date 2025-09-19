import React from "react";
import { useTranslation } from "react-i18next";

const CategoryModal = ({
  isOpen,
  onClose,
  categoryStack,
  handleBackCategory,
  currentCategories,
  handleCategoryClick,
  loadingCategories,
}) => {
  if (!isOpen) return null;
    const { t } = useTranslation();
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{t("Choose Category")}</h2>
        {categoryStack.length > 0 && (
          <button
            className="mb-2 text-green-600 text-sm"
            onClick={handleBackCategory}
          >
            ← Back
          </button>
        )}
        {loadingCategories ? (
          <div className="py-6 text-center text-gray-500">{t("Loading...")}</div>
        ) : (
          <ul>
            {currentCategories?.map((cat, idx) => (
              <li
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className="flex justify-between items-center py-3 px-2 hover:bg-gray-100 cursor-pointer"
              >
                <span>{cat.name}</span>
                <span className="text-gray-400">{">"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryModal; 