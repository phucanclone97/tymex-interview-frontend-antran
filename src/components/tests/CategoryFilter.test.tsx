import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryFilter from "../CategoryFilter";
import { Category } from "@/types/nft";

describe("CategoryFilter", () => {
  const mockCategories: Category[] = [
    { id: "all", label: "All" },
    { id: "upper-body", label: "Upper Body" },
    { id: "lower-body", label: "Lower Body" },
    { id: "hat", label: "Hat" },
  ];

  it("renders all category buttons", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={() => {}}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.label)).toBeVisible();
    });
  });

  it("applies correct styling to selected category", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="upper-body"
        onCategoryChange={() => {}}
      />
    );

    const selectedButton = screen.getByText("Upper Body");
    const nonSelectedButton = screen.getByText("All");

    expect(selectedButton).toHaveClass("bg-purple-600");
    expect(selectedButton).toHaveClass("text-white");
    expect(nonSelectedButton).toHaveClass("bg-gray-800");
    expect(nonSelectedButton).toHaveClass("text-gray-300");
  });

  it("calls onCategoryChange with correct id when category is clicked", () => {
    const handleCategoryChange = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={handleCategoryChange}
      />
    );

    const hatButton = screen.getByText("Hat");
    fireEvent.click(hatButton);

    expect(handleCategoryChange).toHaveBeenCalledWith("hat");
  });

  it("renders gradient fade effect for scrolling", () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={() => {}}
      />
    );

    // Find the gradient div at the right edge
    const gradientDiv = document.querySelector(".bg-gradient-to-l");
    expect(gradientDiv).toBeVisible();
    expect(gradientDiv).toHaveClass("from-gray-900");
    expect(gradientDiv).toHaveClass("to-transparent");
  });
});
