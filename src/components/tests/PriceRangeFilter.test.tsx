import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PriceRangeFilter from "../PriceRangeFilter";

describe("PriceRangeFilter", () => {
  const defaultProps = {
    minPrice: 0,
    maxPrice: 100,
    currentMin: 20,
    currentMax: 80,
    onPriceChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with provided min and max values", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    // Check that price labels are displayed
    expect(screen.getByText("20.00")).toBeVisible();
    expect(screen.getByText("80.00")).toBeVisible();

    // Check "ETH" text is displayed twice
    const ethTexts = screen.getAllByText("ETH");
    expect(ethTexts).toHaveLength(2);
  });

  it("updates local state when props change", () => {
    const { rerender } = render(<PriceRangeFilter {...defaultProps} />);

    // Initial render shows 20.00 and 80.00
    expect(screen.getByText("20.00")).toBeVisible();
    expect(screen.getByText("80.00")).toBeVisible();

    // Update props
    rerender(
      <PriceRangeFilter {...defaultProps} currentMin={30} currentMax={70} />
    );

    // Should update to new values
    expect(screen.getByText("30.00")).toBeVisible();
    expect(screen.getByText("70.00")).toBeVisible();
  });

  it("has two range inputs", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    const inputs = screen.getAllByRole("slider");
    expect(inputs).toHaveLength(2);

    // Check values match props
    expect(inputs[0]).toHaveValue("20"); // Min slider
    expect(inputs[1]).toHaveValue("80"); // Max slider
  });

  it("updates min value when min slider changes", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    const inputs = screen.getAllByRole("slider");
    const minSlider = inputs[0];

    // Change min slider value
    fireEvent.change(minSlider, { target: { value: "30" } });

    // Local state should update
    expect(screen.getByText("30.00")).toBeVisible();

    // But onPriceChange shouldn't be called yet (only on mouseUp/touchEnd)
    expect(defaultProps.onPriceChange).not.toHaveBeenCalled();

    // Trigger mouseUp
    fireEvent.mouseUp(minSlider);

    // Now onPriceChange should be called
    expect(defaultProps.onPriceChange).toHaveBeenCalledWith(30, 80);
  });

  it("updates max value when max slider changes", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    const inputs = screen.getAllByRole("slider");
    const maxSlider = inputs[1];

    // Change max slider value
    fireEvent.change(maxSlider, { target: { value: "70" } });

    // Local state should update
    expect(screen.getByText("70.00")).toBeVisible();

    // But onPriceChange shouldn't be called yet (only on mouseUp/touchEnd)
    expect(defaultProps.onPriceChange).not.toHaveBeenCalled();

    // Trigger mouseUp
    fireEvent.mouseUp(maxSlider);

    // Now onPriceChange should be called
    expect(defaultProps.onPriceChange).toHaveBeenCalledWith(20, 70);
  });

  it("enforces min value cannot exceed max value", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    const inputs = screen.getAllByRole("slider");
    const minSlider = inputs[0];

    // Try to set min value higher than max
    fireEvent.change(minSlider, { target: { value: "90" } });

    // Should be capped at max-1
    expect(screen.getByText("79.00")).toBeVisible();
  });

  it("enforces max value cannot be less than min value", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    const inputs = screen.getAllByRole("slider");
    const maxSlider = inputs[1];

    // Try to set max value lower than min
    fireEvent.change(maxSlider, { target: { value: "10" } });

    // Should be capped at min+1
    expect(screen.getByText("21.00")).toBeVisible();
  });

  it("has a colored track between the two slider thumbs", () => {
    render(<PriceRangeFilter {...defaultProps} />);

    // Find colored range div
    const coloredTrack = document.querySelector(".bg-purple-600");
    expect(coloredTrack).toBeVisible();

    // Check style is set with correct percentage positions
    expect(coloredTrack).toHaveStyle({
      left: "20%",
      width: "60%",
    });
  });
});
