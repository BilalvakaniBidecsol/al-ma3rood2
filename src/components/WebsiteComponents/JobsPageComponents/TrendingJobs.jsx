"use client";
import { useRef } from "react";
import JobCard from "./JobCard";

const jobs = [
  {
    title: "Change Manager",
    company: "Compak International",
    location: "Huston",
    date: "Yesterday",
    description:
      "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    title: "Senior Developer",
    company: "Tech Solutions Ltd",
    location: "Auckland",
    date: "2 days ago",
    description:
      "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    title: "UX Designer",
    company: "Creative Studio",
    location: "Wellington",
    date: "3 days ago",
    description:
      "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    title: "Product Owner",
    company: "InnovateX",
    location: "Christchurch",
    date: "Today",
    description:
      "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
];

export default function TrendingJobs() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div
          className="inline-block pb-1 border-b-2 "
          style={{ borderColor: "#7B7B7B" }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Trending Jobs</h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Job Cards */}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth custom-scroll-hide"
        >
          {jobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
}
