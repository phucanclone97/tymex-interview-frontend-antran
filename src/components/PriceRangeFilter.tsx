import React, { useState } from "react";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  currentMin: number;
  currentMax: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  currentMin,
  currentMax,
}) => {
  // Local state for the sliders
  const [localMin, setLocalMin] = useState<number>(currentMin);
  const [localMax, setLocalMax] = useState<number>(currentMax);

  // Handle final changes (when slider is released)
  const handleRangeChange = () => {
    onPriceChange(localMin, localMax);
  };

  // Handle local changes (while slider is being dragged)
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setLocalMin(Math.min(value, localMax));
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setLocalMax(Math.max(value, localMin));
  };

  // Calculate the percentage for slider background
  const getTrackBackground = () => {
    const minPercent = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPercent = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;
    return `linear-gradient(to right, 
      #0f172a ${minPercent}%, 
      #c026d3 ${minPercent}%, 
      #c026d3 ${maxPercent}%, 
      #0f172a ${maxPercent}%)`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-white">Price Range</h3>
        <div className="text-lg font-medium px-4 py-2 rounded-full bg-purple-600 text-white">
          {localMin} - {localMax} ETH
        </div>
      </div>

      <div className="pt-8 pb-12 px-2 relative">
        {/* Slider track with gradient background */}
        <div
          className="absolute h-2 left-0 right-0 rounded-full"
          style={{
            background: getTrackBackground(),
            top: "24px",
            zIndex: 1,
          }}
        ></div>

        {/* Price range inputs */}
        <div className="relative">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMin}
            onChange={handleMinChange}
            onMouseUp={handleRangeChange}
            onTouchEnd={handleRangeChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10"
            style={{
              WebkitAppearance: "none",
              top: "0px",
            }}
          />

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localMax}
            onChange={handleMaxChange}
            onMouseUp={handleRangeChange}
            onTouchEnd={handleRangeChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10"
            style={{
              WebkitAppearance: "none",
              top: "0px",
            }}
          />
        </div>

        {/* Min/Max labels - moved below the slider */}
        <div className="flex justify-between text-xl text-gray-300 absolute left-0 right-0 top-12">
          <span>{minPrice} ETH</span>
          <span>{maxPrice} ETH</span>
        </div>
      </div>

      <button
        onClick={() => onPriceChange(minPrice, maxPrice)}
        className="w-full px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-medium rounded-xl transition-colors"
      >
        Reset Filters
      </button>

      <style jsx>{`
        /* Custom styling for range inputs */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 3px solid #c026d3;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 15px rgba(192, 38, 211, 0.8);
          z-index: 20;
          position: relative;
          margin-top: -15px; /* Center the thumb on the track */
        }

        input[type="range"]::-moz-range-thumb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 3px solid #c026d3;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 15px rgba(192, 38, 211, 0.8);
          z-index: 20;
          position: relative;
        }

        /* Hide default track */
        input[type="range"]::-webkit-slider-runnable-track {
          background: transparent;
          height: 2px;
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 2px;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeFilter;
