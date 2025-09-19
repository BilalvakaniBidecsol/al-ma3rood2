// components/JobCard.jsx
export default function JobCard({ title, company, location, date, description }) {
  return (
    <div className="bg-[#F8F8F8] border border-gray-200 rounded-lg p-6 min-w-[350px]  hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-[#175f48] text-sm">{date}</span>
      </div>

      <div className="flex items-center text-gray-600 text-sm mb-4">
        <span className="font-medium">{company}</span>
        <span className="mx-2">|</span>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {location}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {description}
      </p>

      <button className="w-full bg-[#175f48] hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
        Apply Now
      </button>
    </div>
  );
}
