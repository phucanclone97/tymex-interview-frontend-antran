import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("renders correctly with default placeholder", () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const searchInput = screen.getByPlaceholderText("Search NFTs...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    const handleChange = jest.fn();
    render(
      <SearchBar
        value=""
        onChange={handleChange}
        placeholder="Custom placeholder"
      />
    );

    const searchInput = screen.getByPlaceholderText("Custom placeholder");
    expect(searchInput).toBeInTheDocument();
  });

  it("displays the provided value", () => {
    const handleChange = jest.fn();
    render(<SearchBar value="test query" onChange={handleChange} />);

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveValue("test query");
  });

  it("calls onChange when input value changes", () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(handleChange).toHaveBeenCalledWith("new search");
  });
});
