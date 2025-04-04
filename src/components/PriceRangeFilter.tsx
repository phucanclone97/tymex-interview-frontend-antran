import React, { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin: number;
  currentMax: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onPriceChange,
}) => {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  // Calculate percentage for the slider track
  const minPos = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPos = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(value);
  };

  const handleMinCommit = () => {
    onPriceChange(localMin, localMax);
  };

  const handleMaxCommit = () => {
    onPriceChange(localMin, localMax);
  };

  return (
    <div className="text-white">
      <div className="relative mb-6 mt-8">
        {/* Slider track */}
        <div className="w-full h-1 bg-gray-700 rounded-md"></div>

        {/* Colored range */}
        <div
          className="absolute h-1 bg-purple-600 rounded-md"
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        ></div>

        {/* Min thumb */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={handleMinCommit}
          onTouchEnd={handleMinCommit}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none"
          style={
            {
              "--thumb-size": "1.25rem",
              "--thumb-color": "#9333ea",
            } as React.CSSProperties
          }
        />

        {/* Max thumb */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={handleMaxCommit}
          onTouchEnd={handleMaxCommit}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none"
          style={
            {
              "--thumb-size": "1.25rem",
              "--thumb-color": "#9333ea",
            } as React.CSSProperties
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-1">
          <span className="font-medium">{localMin.toFixed(2)}</span>
          <span>ETH</span>
        </div>
        <div className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-1">
          <span className="font-medium">{localMax.toFixed(2)}</span>
          <span>ETH</span>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          pointer-events: auto;
          border: 2px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          pointer-events: auto;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeFilter;
