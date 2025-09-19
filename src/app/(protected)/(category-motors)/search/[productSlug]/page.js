import React from "react";
import { fetchProduct, fetchAllMotorsApi } from "@/lib/api/listings.server";
import CarListing from "@/components/WebsiteComponents/CarDetailComponents/car-listing";
import ProductDetailsClient from "@/components/WebsiteComponents/CarDetailComponents/ProductDetailsClient";

const page = async ({ params }) => {
  const { productSlug } = await params;
  const product = await fetchProduct(productSlug);
  const motors = await fetchAllMotorsApi();

  console.log("motors",motors);
  

  const items = [
    { label: "Home", href: "/" },
    { label: "Motors", href: "/motors" },
    {
      label: "Search",
      href: `/search`,
    },
    { label: product.title || "Product" },
  ];

  return (
    <div className="bg-white min-h-screen relative">
      {/* {product?.listing?.vehicle_type !== "Car parts & accessories" ? (
        <CarListing product={product.listing} dealer_listing={product.dealers_other_listings} motors={motors?.data}/>
      ) : ( */}
        <ProductDetailsClient product={product?.listing} />
      {/* )} */}
    </div>
  );
};

export default page;
