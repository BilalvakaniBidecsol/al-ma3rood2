import React from "react";

const Cards = ({ cards }) => {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="grid gap-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-20 justify-items-center">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-[400px] border rounded-md p-4 flex flex-col justify-between h-36"
          >
            <div>
              <h3 className="text-xl mb-2">{card.title}</h3>
              <p className="text-sm font-semibold">{card.subtitle}</p>
              {card.description && (
                <p className="text-sm text-gray-600">{card.description}</p>
              )}
            </div>
            <div className="mt-auto flex justify-end">
              <button className="bg-[#469BDB] text-white text-sm px-4 py-2 rounded hover:bg-green-600">
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
