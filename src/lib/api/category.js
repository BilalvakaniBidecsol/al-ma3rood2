import axiosClient from "./axiosClient";

export const categoriesApi = {
  getAllCategories: (categoryId, listing_type) =>
    categoryId
      ? axiosClient.get(
          `/category?status=1&category_type=${listing_type ? listing_type : 'marketplace'}&parent_id=${categoryId}`
        )
      : axiosClient.get(`/category?status=1&category_type=${listing_type ? listing_type : 'marketplace'}`),
      
      
      // getCategoryTree: () =>
      //   axiosClient.get(
      //     "https://ma3rood.datainovate.com/backend/api/category/tree"
      //   ),
};
