"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const articles = [
  {
    title: "How grocers are approaching delivery as the market evolves",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest1.png",
    author: "zidan",
    date: "3 Nov 2023",
  },
  {
    title: "The Friday Checkout: Food insecurity keeps retailers off balance",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest2.png",
    author: "zidan",
    date: "3 Nov 2023",
  },
  {
    title: "Consumer want grocer to use AI to help them save money Dunnhumby",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest3.png",
    author: "zidan",
    date: "3 Nov 2023",
  },
  {
    title:
      "Order up! How grocers are replicating the restaurant experience in retail",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest4.png",
    author: "zidan",
    date: "3 Nov 2023",
  },
];

const LatestNews = () => {
    const { t } = useTranslation();
  return (
    <section className="mt-10 md:px-4">
      <h2 className="text-2xl font-semibold mb-6">{t("Latest News")}</h2>

      {/* For mobile screen only */}
      <div className="block sm:hidden space-y-6">
        {/* First article in large card */}
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <div className="relative w-full h-48">
            <Image
              src={articles[0].image}
              alt={articles[0].title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{t(articles[0].title)}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t(articles[0].description)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t("by")} {articles[0].author} · {articles[0].date}
              </p>
          </div>
        </div>

        {/* Remaining articles in small horizontal cards */}
        {articles.slice(1).map((article, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-white rounded-lg p-3 shadow"
          >
            <div className="relative w-24 h-20 flex-shrink-0">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-md"
                sizes="100px"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{t(article.title)}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {t(article.description)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("by")} {article.author} · {article.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* For sm and larger screens: regular grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow flex flex-col"
          >
            <div className="relative w-full h-40">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 flex-1">
              <h3 className="text-sm font-semibold">{t(article.title)}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {t(article.description)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {t("by")} {article.author} · {article.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
