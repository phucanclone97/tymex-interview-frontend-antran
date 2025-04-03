import React, { useState, useEffect } from "react";

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
  const [min, setMin] = useState<number>(currentMin);
  const [max, setMax] = useState<number>(currentMax);
  const [localMin, setLocalMin] = useState<number>(currentMin);
  const [localMax, setLocalMax] = useState<number>(currentMax);

  // Update the component state when props change
  useEffect(() => {
    setMin(currentMin);
    setLocalMin(currentMin);
    setMax(currentMax);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  // Handle local changes without triggering API calls
  const handleLocalMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, localMax);
    setLocalMin(newMin);
  };

  const handleLocalMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Ensure max doesn't fall below min
    const newMax = Math.max(value, localMin);
    setLocalMax(newMax);
  };

  // Handle final changes when slider is released
  const handleMinChangeComplete = () => {
    if (localMin !== min) {
      setMin(localMin);
      onPriceChange(localMin, max);
    }
  };

  const handleMaxChangeComplete = () => {
    if (localMax !== max) {
      setMax(localMax);
      onPriceChange(min, localMax);
    }
  };

  // Handle input field changes (these trigger immediate updates)
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, max);
    setLocalMin(newMin);
    setMin(newMin);
    onPriceChange(newMin, max);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Ensure max doesn't fall below min
    const newMax = Math.max(value, min);
    setLocalMax(newMax);
    setMax(newMax);
    onPriceChange(min, newMax);
  };

  // Calculate percentage for the slider fill
  const minPercent = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Price Range</h3>

      {/* Price values display */}
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {localMin.toFixed(2)} ETH
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {localMax.toFixed(2)} ETH
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-2 mb-6">
        {/* Track background */}
        <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>

        {/* Selected range fill */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        ></div>

        {/* Min thumb */}
        <input
          type="range"
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer opacity-0"
          min={minPrice}
          max={maxPrice}
          step={0.01}
          value={localMin}
          onChange={handleLocalMinChange}
          onMouseUp={handleMinChangeComplete}
          onTouchEnd={handleMinChangeComplete}
        />

        {/* Max thumb */}
        <input
          type="range"
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer opacity-0"
          min={minPrice}
          max={maxPrice}
          step={0.01}
          value={localMax}
          onChange={handleLocalMaxChange}
          onMouseUp={handleMaxChangeComplete}
          onTouchEnd={handleMaxChangeComplete}
        />

        {/* Visible thumbs */}
        <div
          className="absolute w-4 h-4 bg-white dark:bg-blue-600 border border-blue-500 rounded-full shadow -translate-x-1/2 -top-1"
          style={{ left: `${minPercent}%` }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-white dark:bg-blue-600 border border-blue-500 rounded-full shadow -translate-x-1/2 -top-1"
          style={{ left: `${maxPercent}%` }}
        ></div>
      </div>

      {/* Min-max input fields */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Min
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            min={minPrice}
            max={max}
            step={0.01}
            value={localMin}
            onChange={handleMinInputChange}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Max
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            min={min}
            max={maxPrice}
            step={0.01}
            value={localMax}
            onChange={handleMaxInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
